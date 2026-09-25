import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;   // ✅ JSX element, NOT the raw Outlet
}