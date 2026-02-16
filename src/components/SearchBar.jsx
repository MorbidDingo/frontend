import React from "react";

export default function SearchBar({ placeholder, value, onChange, onClear }) {
  return (
    <div className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder || "Search..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
