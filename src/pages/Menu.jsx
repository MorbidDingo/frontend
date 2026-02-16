import React, { useState } from "react";
import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";

export default function Menu({ foods = [], onAdd }) {
  const [searchTerm, setSearchTerm] = useState("");

  const term = searchTerm.toLowerCase();

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(term) ||
    food.description.toLowerCase().includes(term) ||
    (food.category && food.category.toLowerCase().includes(term))
  );

  return (
    <div className="container">
      <h2 className="mb-4">Menu</h2>

      <SearchBar
        placeholder="Search by name or description..."
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      <div className="row g-4">
        {filteredFoods.map((food) => (
          <div key={food._id} className="col-sm-6 col-md-4 col-lg-3">
            <FoodCard
              food={food}
              view="menu"
              onAdd={onAdd}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
