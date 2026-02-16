import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import { saveToken, saveUser } from "../lib/auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setMessage(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="mb-0">Admin Login</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAdminLogin}>
                <div className="mb-3">
                  <label className="form-label">Admin Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Admin Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              {message && (
                <div className={`alert ${message.includes("invalid") ? "alert-danger" : "alert-info"} mt-3`}>
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
