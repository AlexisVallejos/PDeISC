async function transformar() {
  const texto = document.getElementById('textoInput').value;
  const res   = await fetch(`/api/uppercase?texto=${encodeURIComponent(texto)}`);
  const data  = await res.json();

  document.getElementById('textoOriginal').textContent  = data.original;
  document.getElementById('textoUppercase').textContent = data.uppercase;
  document.getElementById('longitud').textContent       = data.longitud;
  document.getElementById('palabras').textContent       = data.palabras;
  document.getElementById('resultadoUC').classList.remove('hidden');
}
