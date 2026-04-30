let frutas = ['Manzana', 'Banana'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-fruta" placeholder="Nueva fruta">
    <button id="btn-agregar">Agregar con push()</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputFruta = document.getElementById('input-fruta');
const btnAgregar = document.getElementById('btn-agregar');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';
    frutas.forEach(fruta => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = fruta;
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

btnAgregar.addEventListener('click', () => {
    const fruta = inputFruta.value.trim();

    if (!fruta) {
        showError('Escribi una fruta para agregarla.');
        return;
    }

    clearError();
    const nuevaLongitud = frutas.push(fruta);
    inputFruta.value = '';
    render();
    setOutput(`push("${fruta}") agrego el elemento al final. Nueva longitud: ${nuevaLongitud}.`);
});

inputFruta.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnAgregar.click();
    }
});

btnReset.addEventListener('click', () => {
    frutas = ['Manzana', 'Banana'];
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Escribi una fruta y agregala al final del array.');
