import { useState } from "react";
import Login from "./components/Login/Login.tsx";
import Register from "./components/Register/Register.tsx";
import UserProfile from "./components/UserProfile/UserProfile.tsx";

function App() {
  const [user, setUser] = useState({
    id: 1,
    name: "Subodh",
    role: "admin",
  });
  const [isAuthenticated] = useState(false);
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <div className="app">
      {isAuthenticated ? (
        <UserProfile user={user} />
      ) : view === "login" ? (
        <Login onSwitchToRegister={() => setView("register")} />
      ) : (
        <Register onSwitchToLogin={() => setView("login")} />
      )}
    </div>
  );
}

export default App;
