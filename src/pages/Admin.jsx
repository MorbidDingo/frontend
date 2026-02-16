import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { socket } from "../lib/socket";
import { getToken, isAdmin } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

export default function Admin() {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    stock: ""
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/auth");
    }
  }, [navigate]);

  const fetchFoodItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/food-items`);
      const data = await res.json();
      setFoodItems(data);
    } catch (err) {
      console.error("couldn't fetch food items", err);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("couldn't fetch orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((cur) => ({ ...cur, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    try {
      const body = {
        name: newItem.name,
        price: parseFloat(newItem.price),
        description: newItem.description,
        stock: newItem.stock !== "" ? parseInt(newItem.stock, 10) : 0
      };

      const res = await fetch(`${API_BASE}/food-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setNewItem({
          name: "",
          price: "",
          description: "",
          stock: ""
        });
        fetchFoodItems();
      } else {
        console.error("failed to add item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const updateFoodItem = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/food-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) fetchFoodItems();
      else console.error("failed to update item");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFoodItems();
    fetchOrders();

    socket.on("ordersUpdated", fetchOrders);
    socket.on("foodItemsUpdated", fetchFoodItems);

    return () => {
      socket.off("ordersUpdated", fetchOrders);
      socket.off("foodItemsUpdated", fetchFoodItems);
    };
  }, []);

  const renderOrderActions = (order) => {
    if (order.status === "placed") {
      return (
        <>
          <button
            className="btn btn-sm btn-warning me-1"
            onClick={() => updateOrderStatus(order._id, "preparing")}
          >
            Preparing
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => cancelOrder(order._id)}
          >
            Cancel
          </button>
        </>
      );
    }

    if (order.status === "preparing") {
      return (
        <>
          <button
            className="btn btn-sm btn-success me-1"
            onClick={() => updateOrderStatus(order._id, "served")}
          >
            Served
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => cancelOrder(order._id)}
          >
            Cancel
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <div className="container">
      <h2 className="mb-4">Admin Panel</h2>

      <section className="mb-5">
        <h4>Add new food item</h4>
        <form onSubmit={handleAddItem} className="row g-2 align-items-end">
          <div className="col-sm-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              value={newItem.name}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-2">
            <label className="form-label">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={newItem.price}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-2">
            <label className="form-label">Stock</label>
            <input
              name="stock"
              type="number"
              value={newItem.stock}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-3">
            <label className="form-label">Description</label>
            <input
              name="description"
              value={newItem.description}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              Add item
            </button>
          </div>
        </form>

        {foodItems.length > 0 && (
          <div className="mt-3">
            <h6>Existing items</h6>
            <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
              <ul className="list-group">
                {foodItems.map((it) => (
                  <li
                    key={it._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {it.name} — ₹{it.price}
                      <span className="ms-2">
                        <small>
                          stock: {typeof it.stock === "number" ? it.stock : 0}
                        </small>
                      </span>
                      <span className="ms-2">
                        <small>ordered: {it.totalOrdered || 0}</small>
                      </span>
                    </div>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        const newStock = prompt(
                          "Stock",
                          it.stock != null ? it.stock : "0"
                        );
                        if (newStock != null) {
                          updateFoodItem(it._id, {
                            stock: parseInt(newStock, 10)
                          });
                        }
                      }}
                    >
                      Update
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section>
        <h4>Pending orders</h4>

        <SearchBar
          placeholder="Search by username, status, or item name..."
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />

        {loadingOrders && <p>Loading orders…</p>}
        {!loadingOrders && orders.length === 0 && <p>No orders yet.</p>}

        {orders.length > 0 && (
          <div
            className="table-responsive"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(
                    (order) =>
                      (order.username &&
                        order.username
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())) ||
                      (order.status &&
                        order.status
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())) ||
                      (order.items &&
                        order.items.some((item) =>
                          item.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ))
                  )
                  .map((o, idx) => (
                    <tr key={o._id}>
                      <td>{idx + 1}</td>
                      <td>
                        <small>{o.username || "—"}</small>
                      </td>
                      <td>
                        {o.items && o.items.length > 0
                          ? o.items.map((i) => i.name).join(", ")
                          : "—"}
                      </td>
                      <td>
                        ₹{" "}
                        {o.total != null
                          ? o.total
                          : o.items
                          ? o.items.reduce(
                              (s, i) =>
                                s + (i.price || 0) * (i.quantity || 1),
                              0
                            )
                          : 0}
                      </td>
                      <td>
                        <span className="badge bg-secondary text-uppercase">
                          {o.status}
                        </span>
                      </td>
                      <td>{renderOrderActions(o)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
