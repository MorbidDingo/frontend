import React, { useState } from "react";
import { API_BASE } from "../lib/api";
import { saveToken, saveUser, isAuthenticated } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [tab, setTab] = useState("login"); // login, register, admin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        saveUser(data.userId, "user");
        setMessage("Registered! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        saveUser(data.userId, data.role);
        setMessage("Logged in! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.token);
        saveUser("admin", "admin");
        setMessage("Admin logged in! Redirecting...");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated()) {
    return <p>You are already logged in. <a href="/">Go to home</a></p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "login" ? "active" : ""}`}
                    onClick={() => { setTab("login"); setMessage(""); }}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "register" ? "active" : ""}`}
                    onClick={() => { setTab("register"); setMessage(""); }}
                  >
                    Register
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "admin" ? "active" : ""}`}
                    onClick={() => { setTab("admin"); setMessage(""); }}
                  >
                    Admin
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              {tab === "login" && (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              )}

              {tab === "register" && (
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </form>
              )}

              {tab === "admin" && (
                <form onSubmit={handleAdminLogin}>
                  <div className="alert alert-info" role="alert">
                    Admin login only
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Admin Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Admin Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Admin Login"}
                  </button>
                </form>
              )}

              {message && (
                <div className="alert alert-info mt-3">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
