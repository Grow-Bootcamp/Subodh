import { useEffect, useState } from "react";
import styles from "./AdminUserList.module.css";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type FetchStatus = "loading" | "ready" | "error";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users/profile/admin`;

const AdminUserList = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        setStatus("error");
        return;
      }
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok || !data?.success) {
          throw new Error(data?.message ?? "Failed to fetch users");
        }
        setUsers(data.users ?? []);
        setStatus("ready");
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setError(error instanceof Error ? error.message : String(error));
        setStatus("error");
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>All Users (max 10)</h2>
      {status === "loading" && <p>Loading users…</p>}
      {status === "error" && <p style={{ color: "red" }}>{error}</p>}
      {status === "ready" && (
        <div className={styles.grid}>
          {users.map((u) => (
            <article key={u.id} className={styles.card}>
              <div className={styles.roleBadge}>{u.role}</div>
              <h3 className={styles.name}>{u.name}</h3>
              <span className={styles.email}>{u.email}</span>
              <span className={styles.userId}>User number {u.id}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminUserList;
