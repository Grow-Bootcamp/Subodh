import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { RequireAuth, RequireRole } from "./RouteGuards";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import AdminPage from "./AdminPage";
import "./index.css";

function NotFoundPage() {
  return <main className="panel"><h1>Page not found</h1><a href="/">Go to dashboard</a></main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<DashboardPage />} />
            <Route element={<RequireRole requiredRole="admin" />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
