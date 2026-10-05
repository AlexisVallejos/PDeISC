import { conEnfasis } from '../utils/texto'
import Aparecer from './Aparecer'

// Sección con el encabezado de la referencia: sobretítulo en versalitas, título con una
// parte en serif itálica (*así*) y, opcionalmente, una descripción y una acción a la derecha.
// Con `lateral`, el encabezado ocupa una columna a la izquierda del contenido (como Experiencia).
export default function Seccion({ id, sobretitulo, titulo, descripcion, accion, lateral, className = '', children }) {
  return (
    <section id={id} className={`seccion ${className}`} aria-labelledby={`${id}-titulo`}>
      <div className={lateral ? 'contenedor seccion-lateral' : 'contenedor'}>
        <Aparecer as="header" className={descripcion || accion ? 'encabezado encabezado--ancho' : 'encabezado'}>
          <div>
            <p className="sobretitulo">{sobretitulo}</p>
            <h2 id={`${id}-titulo`} className="titulo-seccion">
              {conEnfasis(titulo)}
            </h2>
          </div>
          {descripcion && <p className="encabezado-descripcion">{descripcion}</p>}
          {accion && <div className="encabezado-accion">{accion}</div>}
        </Aparecer>
        {children}
      </div>
    </section>
  )
}
