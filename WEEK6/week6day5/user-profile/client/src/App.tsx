import { useEffect, useState } from "react";
import Login from "./components/Login/Login.tsx";
import Register from "./components/Register/Register.tsx";
import UserProfile, {
  type User,
} from "./components/UserProfile/UserProfile.tsx";
import AdminUserList from "./components/AdminUserList/AdminUserList.tsx";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users/profile/user`;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const controller = new AbortController();
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
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
          throw new Error(data?.message ?? "Failed to fetch user data");
        }

        if (!data.user) {
          throw new Error("No user data fetched");
        }
        setUser(data.user);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message = error instanceof Error ? error.message : String(error);
        setError(message);
      }
    };
    fetchUserData();

    return () => controller.abort();
  }, [API_URL, isAuthenticated]);

  return (
    <div className="app">
      {isAuthenticated ? (
        user ? (
          <>
            <UserProfile user={user} />
            {user.role === "admin" && <AdminUserList />}
          </>
        ) : (
          <p>Loading profile…</p>
        )
      ) : view === "login" ? (
        <Login
          onSwitchToRegister={() => setView("register")}
          setIsAuthenticated={setIsAuthenticated}
        />
      ) : (
        <Register onSwitchToLogin={() => setView("login")} />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
