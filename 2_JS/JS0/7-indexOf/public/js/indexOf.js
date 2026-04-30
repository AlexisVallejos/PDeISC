let palabras = ['gato', 'perro', 'casa', 'perro'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-palabra" placeholder="Buscar palabra">
    <button id="btn-buscar">Buscar con indexOf()</button>
    <button id="btn-agregar">Agregar palabra</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputPalabra = document.getElementById('input-palabra');
const btnBuscar = document.getElementById('btn-buscar');
const btnAgregar = document.getElementById('btn-agregar');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';
    palabras.forEach(palabra => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = palabra;
        container.appendChild(div);
    });
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
}

function setOutput(message) {
    consoleOutput.textContent = message;
}

btnBuscar.addEventListener('click', () => {
    const palabra = inputPalabra.value.trim();

    if (!palabra) {
        showError('Escribi una palabra para buscarla.');
        return;
    }

    clearError();
    const indice = palabras.indexOf(palabra);
    const mensaje = indice === -1
        ? `"${palabra}" no aparece en el array.`
        : `indexOf("${palabra}") encontro la primera coincidencia en la posicion ${indice}.`;
    setOutput(mensaje);
});

btnAgregar.addEventListener('click', () => {
    const palabra = inputPalabra.value.trim();

    if (!palabra) {
        showError('Escribi una palabra para agregarla.');
        return;
    }

    clearError();
    palabras.push(palabra);
    inputPalabra.value = '';
    render();
    setOutput(`Se agrego "${palabra}" al array.`);
});

inputPalabra.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnBuscar.click();
    }
});

btnReset.addEventListener('click', () => {
    palabras = ['gato', 'perro', 'casa', 'perro'];
    inputPalabra.value = '';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Escribi una palabra para buscarla o agregarla.');
