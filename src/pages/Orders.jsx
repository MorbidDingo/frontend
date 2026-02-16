import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { API_BASE, getUserId } from "../lib/api";
import { getToken } from "../lib/auth";
import { socket } from "../lib/socket";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const res = await fetch(`${API_BASE}/orders?userId=${userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("couldn't fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "DELETE",
        headers: {
          ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
        },
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const err = await res.json();
        alert(err.error || 'Unable to cancel order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    socket.on('ordersUpdated', fetchOrders);
    return () => {
      socket.off('ordersUpdated', fetchOrders);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (orders.length === 0) {
    return <p>You have no orders.</p>;
  }

  const filteredOrders = orders.filter(
    (order) =>
      (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.items &&
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  return (
    <div>
      <h2 className="mb-4">My Orders</h2>
      <SearchBar
        placeholder="Search by status or item name..."
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, idx) => (
              <tr key={o._id}>
                <td>{idx + 1}</td>
                <td>{
                  o.items && o.items.length > 0
                    ? o.items.map((i) => i.name).join(', ')
                    : '—'
                }</td>
                <td>₹ {o.total != null ? o.total : (
                  o.items ? o.items.reduce((s,i)=>s + (i.price||0)*(i.quantity||1),0) : 0
                )}</td>
                <td>{o.status}</td>
                <td>
                  {o.status === 'placed' && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => cancelOrder(o._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
