import React, { useState } from "react";
import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";

export default function Cart({ cart = [], onAdd, onRemove, onClear, message }) {
  const [searchTerm, setSearchTerm] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  const filteredCart = cart.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">My Cart</h2>
      <SearchBar
        placeholder="Search in cart..."
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      <div className="row g-4">
        {filteredCart.map((item) => (
          <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
            <FoodCard
              food={item}
              view="cart"
              quantity={item.quantity}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h5>Total: ₹{total.toFixed(2)}</h5>
        {message && <p className="mt-2 text-info">{message}</p>}
      </div>
    </div>
  );
}
