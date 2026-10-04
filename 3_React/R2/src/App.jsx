import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TareasProvider } from "./context/TareasContext";
import { TemaProvider } from "./context/TemaContext";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import DetalleTarea from "./pages/DetalleTarea";
import CrearTarea from "./pages/CrearTarea";
import NoEncontrado from "./pages/NoEncontrado";

// componente raiz, aca defino todas las rutas de la spa
function App() {
  return (
    <TemaProvider>
      <TareasProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="tareas/:id" element={<DetalleTarea />} />
              <Route path="crear" element={<CrearTarea />} />
              {/* cualquier ruta que no matchee cae aca */}
              <Route path="*" element={<NoEncontrado />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TareasProvider>
    </TemaProvider>
  );
}

export default App;
