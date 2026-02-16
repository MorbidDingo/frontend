import React, { useState } from "react";
import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";

export default function Menu({ foods = [], onAdd }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFoods = foods.filter(
    (food) =>
      food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.category && food.category.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <div key={food.id} className="col-sm-6 col-md-4 col-lg-3">
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
