// Modulo de la consigna 3.
// Analiza una URL nativa de JavaScript y muestra sus partes por consola.

export const URL_EJEMPLO = 'https://www.mercadolibre.com.ar/ofertas/ofertas-futboleras#c_id=/home/exhibitors-carousel/element&c_campaign=display%2Fclicks%2FMLA%2Fcount&c_element_order=1&c_uid=fc6b525e-3f1a-4bb5-b7a1-30c421003ac7';

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
