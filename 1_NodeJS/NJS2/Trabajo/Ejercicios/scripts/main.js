async function consultarClima() {
  const ciudad = document.getElementById('ciudad').value;
  const res    = await fetch(`/api/clima?ciudad=${encodeURIComponent(ciudad)}`);
  const data   = await res.json();

  document.getElementById('climaValor').textContent = data.mensaje;
  document.getElementById('resultadoClima').classList.remove('hidden');
}

async function calcular() {
  const a  = document.getElementById('numA').value;
  const b  = document.getElementById('numB').value;
  const op = document.getElementById('operacion').value;

  const res  = await fetch(`/api/calculo?op=${op}&a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
  const data = await res.json();

  document.getElementById('calculoValor').textContent = data.resultado;
  document.getElementById('resultadoCalculo').classList.remove('hidden');
}
