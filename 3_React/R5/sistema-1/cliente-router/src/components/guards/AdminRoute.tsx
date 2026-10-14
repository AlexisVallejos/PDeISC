import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// solo deja pasar a los administradores
export function AdminRoute() {
  const { user } = useAuth();

  return user?.rol === "administrador" ? <Outlet /> : <Navigate to="/" replace />;
}
