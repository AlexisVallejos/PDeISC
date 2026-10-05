import { ArrowUp } from 'lucide-react'
import { primerNombre } from '../utils/texto'

const TEXTO_FUENTE = {
  cargando: 'Conectando con la base de datos…',
  mysql: 'Contenido servido desde MySQL',
  local: 'Sin conexión a la API: mostrando datos locales',
}

export default function Pie({ nombre, fuente, visitas }) {
  return (
    <footer className="pie">
      <div className="contenedor pie-interior">
        <a className="marca" href="#inicio">
          {primerNombre(nombre)}
          <span className="marca-punto" aria-hidden="true" />
        </a>
        <p className="pie-fuente">
          <span className={fuente === 'mysql' ? 'punto punto--verde' : 'punto'} aria-hidden="true" />
          {TEXTO_FUENTE[fuente]}
          {visitas != null && ` · ${visitas.toLocaleString('es-AR')} visitas`}
        </p>
        <p className="pie-copia">
          © {new Date().getFullYear()} {nombre} · Hecho con React y Vite
        </p>
        <a className="boton boton--contorno boton--chico" href="#inicio">
          Volver arriba <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
