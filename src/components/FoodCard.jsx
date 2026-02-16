export default function FoodCard({
  food,
  view = "menu",         // "menu" | "cart" | "orders"
  quantity = 0,
  onAdd,
  onRemove,
}) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{food.title}</h5>

        {food.category && (
          <h6 className="card-subtitle mb-2 text-muted">
            {food.category}
          </h6>
        )}

        {food.desc && (
          <p className="card-text">{food.desc}</p>
        )}

        {food.price && (
          <p className="fw-bold mt-auto">₹ {food.price}</p>
        )}

        {/* ----- ACTION SECTION ----- */}

        {view === "menu" && (
          <>
            <p className="mb-1"><small>Stock: {food.stock != null ? food.stock : 0} • Ordered: {food.totalOrdered || 0}</small></p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => onAdd?.(food)}
              disabled={food.stock != null && food.stock <= 0}
            >
              {food.stock != null && food.stock <= 0 ? 'Out of stock' : 'Add to Cart'}
            </button>
          </>
        )}

        {view === "cart" && (
          <>
            {food.stock != null && (
              <p className="mb-1"><small>Stock: {food.stock}</small></p>
            )}
            <div className="d-flex align-items-center justify-content-between mt-2">
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => onRemove?.(food)}
                >
                  -
                </button>

                <span className="mx-2">{quantity}</span>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onAdd?.(food)}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => onRemove?.(food, true)}
              >
                Remove
              </button>
            </div>
          </>
        )}

        {view === "orders" && (
          <div className="mt-2">
            <span className="badge bg-success">
              {food.status || "Ordered"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
