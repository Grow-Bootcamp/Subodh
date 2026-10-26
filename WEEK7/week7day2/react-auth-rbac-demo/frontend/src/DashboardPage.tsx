import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, type User } from "./AuthContext";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function verify() {
      if (!token) return;
      try {
        const response = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json()) as User & { message?: string };
        if (!response.ok) throw new Error(data.message ?? "Session verification failed.");
        if (active) setVerifiedUser(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Request failed.");
      }
    }
    void verify();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="panel">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.username}. Your role is <strong>{user?.role}</strong>.</p>
      {verifiedUser && <p className="success">Backend verified: {verifiedUser.username}</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {user?.role === "admin" && <p><Link to="/admin">Open admin page</Link></p>}
      <button onClick={logout}>Log out</button>
    </main>
  );
}
