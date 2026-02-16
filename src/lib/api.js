export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export function getUserId() {
  let id = localStorage.getItem('userId');
  if (!id) {
    // crypto.randomUUID is supported in modern browsers
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    localStorage.setItem('userId', id);
  }
  return id;
}
