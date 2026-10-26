import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type Role } from "./AuthContext";

export function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ requiredRole }: { requiredRole: Role }) {
  const { user } = useAuth();
  return user?.role === requiredRole
    ? <Outlet />
    : <Navigate to="/" replace />;
}
