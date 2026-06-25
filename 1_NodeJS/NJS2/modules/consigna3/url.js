// Modulo de la consigna 3.
// Analiza una URL nativa de JavaScript y muestra sus partes por consola.

export const URL_EJEMPLO = 'https://www.nike.com.ar/mas-vendidos?gad_campaignid=19954478100&initialMap=productClusterIds&initialQuery=139&map=productClusterIds,tipo-de-producto,productclusternames,productclusternames&query=/139/botines/mas-vendidos-calzado-indumentaria/mas-vendidos-calzado-indumentaria&searchState';

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
