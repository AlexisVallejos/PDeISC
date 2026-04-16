async function obtenerInfo() {
  const res  = await fetch('/api/info');
  const data = await res.json();

  const filas = [
    ['node version',  data.nodeVersion],
    ['plataforma',    data.plataforma],
    ['uptime',        data.uptime + ' s'],
    ['archivo html',  data.archivo],
    ['módulo fs',     data.moduloFS],
    ['módulo http',   data.moduloHTTP],
  ];

  document.getElementById('infoValor').innerHTML = `
    <table>
      <tbody>
        ${filas.map(([prop, val]) => `<tr><td>${prop}</td><td>${val}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('resultadoInfo').classList.remove('hidden');
}
