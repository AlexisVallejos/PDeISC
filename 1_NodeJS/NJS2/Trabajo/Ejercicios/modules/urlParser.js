function parsearURL(urlString) {
  const parsed = new URL(urlString);
  const params = {};
  parsed.searchParams.forEach((valor, clave) => { params[clave] = valor; });

  return {
    protocolo: parsed.protocol,
    host:      parsed.host,
    hostname:  parsed.hostname,
    puerto:    parsed.port || '(default)',
    pathname:  parsed.pathname,
    search:    parsed.search,
    hash:      parsed.hash,
    origen:    parsed.origin,
    params,
  };
}

module.exports = { parsearURL };
