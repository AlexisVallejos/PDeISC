import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BotonSubir from "./BotonSubir";

// mantiene la navegacion y el contenido alineados en todas las paginas
function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="contenido-app">
        <Outlet />
      </main>
      <BotonSubir />
    </div>
  );
}

export default Layout;
