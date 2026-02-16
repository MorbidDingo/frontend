import { NavLink } from "react-router-dom";
import { isAuthenticated, getUser, clearAuth } from "../lib/auth";
import React from "react";

export default function Navbar({ cartItemCount = 0 }) {
  const { userId, username } = getUser();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <NavLink to="/" className="navbar-brand">
        Venus Canteen
      </NavLink>

      {/* Toggler Button */}
      <button
        className="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Collapsible Content (React-controlled) */}
      <div className={`navbar-collapse ${open ? 'show' : 'collapse'}`} id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive ? "nav-link fw-bold text-primary" : "nav-link"
              }
            >
              Menu
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "nav-link fw-bold text-primary" : "nav-link"
              }
            >
              Cart
              {cartItemCount > 0 && (
                <span className="badge bg-primary ms-1">
                  {cartItemCount}
                </span>
              )}
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "nav-link fw-bold text-primary" : "nav-link"
              }
            >
              Orders
            </NavLink>
          </li>
          {!isAuthenticated() && (
            <li className="nav-item">
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  isActive ? "nav-link fw-bold text-primary" : "nav-link"
                }
              >
                Login
              </NavLink>
            </li>
          )}
          {isAuthenticated() && (
            <>
              <li className="nav-item">
                <span className="nav-link text-muted">
                {username}{username === 'admin' ? ' - Admin' : '- user'}
                </span>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger ms-2"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
