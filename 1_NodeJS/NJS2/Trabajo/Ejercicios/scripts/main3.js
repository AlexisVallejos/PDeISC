async function parsearURL() {
  const urlInput = document.getElementById('urlInput').value.trim();
  if (!urlInput) return;

  const res  = await fetch(`/api/parse-url?url=${encodeURIComponent(urlInput)}`);
  const data = await res.json();

  if (data.error) { alert(data.error); return; }

  const filas = [
    ['protocolo', data.protocolo],
    ['host',      data.host],
    ['hostname',  data.hostname],
    ['puerto',    data.puerto],
    ['pathname',  data.pathname],
    ['search',    data.search  || '(ninguno)'],
    ['hash',      data.hash    || '(ninguno)'],
    ['origen',    data.origen],
  ];

  for (const [clave, valor] of Object.entries(data.params)) {
    filas.push([`param: ${clave}`, valor]);
  }

  document.querySelector('#tablaURL tbody').innerHTML = filas
    .map(([p, v]) => `<tr><td>${p}</td><td>${v}</td></tr>`)
    .join('');

  document.getElementById('resultadoURL').classList.remove('hidden');
}
