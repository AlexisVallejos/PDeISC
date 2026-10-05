import Aparecer from './Aparecer'

export default function Seccion({ id, sobretitulo, titulo, children, className = '' }) {
  return (
    <section id={id} className={`seccion ${className}`} aria-labelledby={`${id}-titulo`}>
      <div className="contenedor">
        <Aparecer as="header" className="seccion-encabezado">
          <p className="sobretitulo">{sobretitulo}</p>
          <h2 id={`${id}-titulo`} className="titulo-seccion">
            {titulo}
          </h2>
        </Aparecer>
        {children}
      </div>
    </section>
  )
}
