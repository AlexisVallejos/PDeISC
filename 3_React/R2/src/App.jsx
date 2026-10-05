import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { TareasProvider } from './context/TareasContext'
import { TemaProvider } from './context/TemaContext'
import CrearTarea from './pages/CrearTarea'
import DetalleTarea from './pages/DetalleTarea'
import Inicio from './pages/Inicio'
import NoEncontrada from './pages/NoEncontrada'

export default function App() {
  return (
    <TemaProvider>
      <TareasProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="tareas/:id" element={<DetalleTarea />} />
              <Route path="crear" element={<CrearTarea />} />
              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TareasProvider>
    </TemaProvider>
  )
}
