/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna3/url.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo de la consigna 3.
// Analiza una URL nativa de JavaScript y muestra sus partes por consola.

export const URL_EJEMPLO = 'https://www.mercadolibre.com.ar/ofertas/ofertas-futboleras#c_id=/home/exhibitors-carousel/element&c_campaign=display%2Fclicks%2FMLA%2Fcount&c_element_order=1&c_uid=fc6b525e-3f1a-4bb5-b7a1-30c421003ac7';

// analizarURL: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function analizarURL(urlString = URL_EJEMPLO) {
  // new URL() separa automaticamente protocolo, host, pathname y parametros.
  const u = new URL(urlString);

  const datos = {
    href: u.href,
    protocol: u.protocol,
    host: u.host,
    hostname: u.hostname,
    port: u.port || '(por defecto)',
    pathname: u.pathname,
    search: u.search || '(sin parametros)',
    hash: u.hash || '(sin hash)',
    origin: u.origin,
    params: Object.fromEntries(u.searchParams.entries()),
  };

  console.log('\n[URL] Analisis del enlace:');
  Object.entries(datos).forEach(([clave, valor]) => {
    console.log(`  ${clave.padEnd(10)}: ${typeof valor === 'object' ? JSON.stringify(valor) : valor}`);
  });

  return datos;
}
