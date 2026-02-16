import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Auth from "./pages/Auth";
import "./index.css";
import Footer from "./components/Footer";
import { API_BASE, getUserId } from "./lib/api";
import { getToken } from "./lib/auth";
import { socket } from "./lib/socket";

function App() {
  // cart state: array of { id, title, type, desc, price, quantity }
  const [cart, setCart] = React.useState([]);

  const handleAddToCart = (food) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === food.id);
      const stock = foodMap[food.id] !== undefined ? foodMap[food.id] : food.stock;
      if (existing) {
        // check against stock if provided
        if (stock !== undefined && existing.quantity >= stock) {
          return current; // can't add more
        }
        return current.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (stock !== undefined && stock <= 0) {
        return current; // out of stock
      }
      return [...current, { ...food, quantity: 1, stock }];
    });
  };

  const handleRemoveFromCart = (food, removeAll = false) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === food.id);
      if (!existing) return current;
      if (removeAll || existing.quantity <= 1) {
        return current.filter((item) => item.id !== food.id);
      }
      return current.map((item) =>
        item.id === food.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const [placing, setPlacing] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // track available foods (with stock and category)
  const [foods, setFoods] = React.useState([]);
  const foodMap = React.useMemo(() => {
    const m = {};
    foods.forEach((f) => {
      m[f.id] = f.stock;
    });
    return m;
  }, [foods]);

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${API_BASE}/food-items`);
      const data = await res.json();
      setFoods(
        data.map((it) => ({
          id: it._id,
          title: it.name,
          desc: it.description,
          price: it.price,
          category: it.category,
          stock: typeof it.stock === 'number' ? it.stock : 0,
          totalOrdered: typeof it.totalOrdered === 'number' ? it.totalOrdered : 0,
        }))
      );
    } catch (err) {
      console.error('failed to fetch menu', err);
    }
  };

  // keep cart stock in sync when foods update
  React.useEffect(() => {
    if (foods.length === 0) return;
    setCart((current) =>
      current.map((item) => {
        const stock = foodMap[item.id];
        if (stock !== undefined) {
          let qty = item.quantity;
          if (qty > stock) qty = stock;
          return { ...item, stock, quantity: qty };
        }
        return item;
      })
    );
  }, [foodMap]);


  const handlePlaceOrder = async () => {
    if (cart.length === 0) return false;
    setPlacing(true);
    setMessage("");
    let success = false;
    try {
      const body = {
        userId: getUserId(),
        items: cart.map(({ id, title, price, quantity }) => ({ id, name: title, price, quantity })),
      };
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setCart([]);
        success = true;
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setPlacing(false);
    }
    return success;
  };

  React.useEffect(() => {
    fetchFoods();
    socket.on('foodItemsUpdated', fetchFoods);
    return () => {
      socket.off('foodItemsUpdated', fetchFoods);
    };
  }, []);

  return (
    <Router>
      <Navbar cartItemCount={cartItemCount} />

      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={<Menu foods={foods} onAdd={handleAddToCart} />}
          />
          <Route
            path="/menu"
            element={<Menu foods={foods} onAdd={handleAddToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
                onClear={handleClearCart}
                message={message}
              />
            }
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        placing={placing}
      />
    </Router>
  );
}

export default App;