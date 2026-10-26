import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export default function AdminPage() {
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadAdminData() {
      if (!token) return;
      try {
        const response = await fetch(`${API}/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(data.message ?? "Access denied.");
        if (active) setMessage(data.message ?? "Admin access granted.");
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Request failed.");
      }
    }
    void loadAdminData();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="panel">
      <h1>Admin page</h1>
      {message && <p className="success">{message}</p>}
      {error && <p role="alert" className="error">{error}</p>}
      <Link to="/">Back to dashboard</Link>
    </main>
  );
}
