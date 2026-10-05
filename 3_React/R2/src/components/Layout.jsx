import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import BotonSubir from './BotonSubir'

export default function Layout() {
  const { pathname } = useLocation()

  // Cada pantalla nueva arranca desde arriba (cambiar de filtro no cuenta).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app-shell">
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <BarraLateral />
      <BarraSuperior />
      <main id="contenido" className="contenido-app" tabIndex={-1}>
        <Outlet />
      </main>
      <BotonSubir />
    </div>
  )
}
