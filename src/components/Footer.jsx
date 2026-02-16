import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer({ cart = [], onPlaceOrder, placing = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Only render something on menu or cart paths
  if (location.pathname === "/cart") {
    const handleClick = async () => {
      if (onPlaceOrder) {
        const ok = await onPlaceOrder();
        if (ok) {
          navigate("/orders");
        }
      }
    };

    return (
      <footer className="fixed-bottom bg-light py-2 border-top">
        <div className="container d-flex justify-content-between align-items-center">
          <span>
            {itemCount === 0
              ? "Please add at least 1 item to place order"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} | ₹${totalAmount}`
            }
          </span>

          <button
            className="btn btn-success"
            disabled={itemCount === 0 || placing}
            onClick={handleClick}
          >
            {placing ? "Placing..." : "Place Order"}
          </button>
        </div>
      </footer>
    );
  }

  if (location.pathname === "/" || location.pathname === "/menu") {
    return (
      <footer className="fixed-bottom bg-light py-2 border-top">
        <div className="container text-center">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/cart")}
            hidden={itemCount === 0}
          >
            Go to Cart{itemCount > 0 && ` (${itemCount})`}
          </button>
        </div>
      </footer>
    );
  }

  return null;
}
