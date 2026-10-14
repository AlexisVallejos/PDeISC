import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { homePath } from "@/utils/homePath";

// cada usuario logueado tiene una sola pantalla: si entra a otra ruta, lo mando a la suya
export function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (user && pathname !== homePath(user)) return <Navigate to={homePath(user)} replace />;

  return (
    <main className={user ? "" : "auth-main"}>
      <Outlet />
    </main>
  );
}
