import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// solo deja pasar a quien tiene sesión
export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p className="center">Cargando sesión...</p>;
  return user ? <Outlet /> : <Navigate to="/ingresar" replace />;
}
