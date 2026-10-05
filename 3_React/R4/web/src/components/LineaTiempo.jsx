import { useLayoutEffect, useRef } from 'react'
import { useAlScrollear } from '../hooks/useAlScrollear'
import { useReducirMovimiento } from '../hooks/useReducirMovimiento'
import Aparecer from './Aparecer'

// La línea se dibuja con el scroll: su punta sigue una "lapicera" ubicada al 62 % de la altura
// de la ventana. Cada punto se enciende cuando la línea lo alcanza y se apaga si volvés para arriba.
const LAPICERA = 0.62

export default function LineaTiempo({ experiencias }) {
  const listaRef = useRef(null)
  const pistaRef = useRef(null)
  const rellenoRef = useRef(null)
  const medidas = useRef({ inicio: 0, alto: 0, centros: [] })
  const reducir = useReducirMovimiento()

  function actualizar() {
    const lista = listaRef.current
    const { inicio, alto, centros } = medidas.current
    if (!lista || !alto) return

    const arriba = lista.getBoundingClientRect().top
    const avance = reducir
      ? 1
      : Math.min(1, Math.max(0, (window.innerHeight * LAPICERA - (arriba + inicio)) / alto))
    rellenoRef.current.style.transform = `scaleY(${avance})`

    // Atributo data (no clase): React re-renderiza className en la animación de entrada y lo borraría.
    const punta = inicio + avance * alto
    lista.querySelectorAll('.hito').forEach((hito, i) => {
      hito.toggleAttribute('data-alcanzado', centros[i] <= punta + 1)
    })
  }

  // Mide dónde está el centro de cada punto (con offsetTop, que ignora las transformaciones
  // de la animación de entrada) y extiende la pista del primero al último.
  useLayoutEffect(() => {
    const lista = listaRef.current
    function medir() {
      const centros = [...lista.querySelectorAll('.hito')].map((hito) => {
        const punto = hito.querySelector('.hito-punto')
        return hito.offsetTop + punto.offsetTop + punto.offsetHeight / 2
      })
      const inicio = centros[0] ?? 0
      const alto = (centros.at(-1) ?? 0) - inicio
      medidas.current = { inicio, alto, centros }
      pistaRef.current.style.top = `${inicio}px`
      pistaRef.current.style.height = `${alto}px`
      actualizar()
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(lista)
    return () => observador.disconnect()
    // actualizar lee refs; alcanza con volver a medir si cambian los datos o la preferencia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiencias, reducir])

  useAlScrollear(actualizar)

  return (
    <ol className="linea-tiempo" ref={listaRef}>
      <li className="linea-pista" ref={pistaRef} aria-hidden="true">
        <span ref={rellenoRef} />
      </li>
      {experiencias.map((e, i) => (
        <Aparecer as="li" key={`${e.rol}-${i}`} orden={i} className={i === 0 ? 'hito es-actual' : 'hito'}>
          <span className="hito-periodo">{e.periodo}</span>
          <span className="hito-punto" aria-hidden="true" />
          <div className="hito-rol">
            <h3>{e.rol}</h3>
            <p>{e.lugar}</p>
          </div>
          <p className="hito-descripcion">{e.descripcion}</p>
        </Aparecer>
      ))}
    </ol>
  )
}
