import { ArrowUp } from 'lucide-react'

const TEXTO_FUENTE = {
  cargando: 'Conectando con la base de datos…',
  mysql: 'Contenido servido desde MySQL',
  local: 'Sin conexión a la API: mostrando datos locales',
}

export default function Pie({ nombre, fuente, visitas }) {
  return (
    <footer className="pie">
      <div className="contenedor pie-interior">
        <p>
          © {new Date().getFullYear()} {nombre}. Hecho con React y Vite.
        </p>
        <p className="pie-fuente">
          <span className={fuente === 'mysql' ? 'punto punto--verde' : 'punto'} aria-hidden="true" />
          {TEXTO_FUENTE[fuente]}
          {visitas != null && ` · ${visitas.toLocaleString('es-AR')} visitas`}
        </p>
        <a className="boton boton--enlace" href="#inicio">
          Volver arriba <ArrowUp size={15} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
