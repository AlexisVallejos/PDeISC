// "Interfaces que *mueven* personas." → las palabras entre asteriscos van en serif itálica.
// Así el énfasis se escribe en la base de datos sin guardar HTML.
export function conEnfasis(texto = '') {
  return texto.split(/\*(.+?)\*/g).map((parte, i) => (i % 2 ? <em key={i}>{parte}</em> : parte))
}

export const primerNombre = (nombre = '') => nombre.split(/\s+/)[0]

// "20+" → { numero: 20, sufijo: '+' }. Si no empieza con un número, numero es null.
export function separarValor(valor = '') {
  const coincide = String(valor).match(/^(\d+(?:[.,]\d+)?)(.*)$/)
  return coincide ? { numero: Number(coincide[1].replace(',', '.')), sufijo: coincide[2] } : { numero: null, sufijo: valor }
}
