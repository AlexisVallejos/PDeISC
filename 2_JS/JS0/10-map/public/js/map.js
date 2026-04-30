let numeros = [2, 4, 6];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-numeros" placeholder="Numeros: 2, 4, 6" value="2, 4, 6">
    <input type="number" id="input-factor" placeholder="Factor" value="3">
    <button id="btn-map">Multiplicar con map()</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputNumeros = document.getElementById('input-numeros');
const inputFactor = document.getElementById('input-factor');
const btnMap = document.getElementById('btn-map');
const btnReset = document.getElementById('btn-reset');

function parseNumbers(value) {
    return value
        .split(',')
        .map(item => Number(item.trim()))
        .filter(numero => Number.isFinite(numero));
}

function render(items = numeros) {
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = item;
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

btnMap.addEventListener('click', () => {
    const valores = parseNumbers(inputNumeros.value);
    const factor = Number(inputFactor.value);

    if (valores.length === 0) {
        showError('Escribi numeros separados por coma.');
        return;
    }

    if (!Number.isFinite(factor)) {
        showError('Escribi un factor valido.');
        return;
    }

    clearError();
    numeros = valores;
    const resultado = numeros.map(numero => numero * factor);
    render(resultado);
    setOutput(`map() creo [${resultado.join(', ')}] sin modificar el original [${numeros.join(', ')}].`);
});

btnReset.addEventListener('click', () => {
    numeros = [2, 4, 6];
    inputNumeros.value = '2, 4, 6';
    inputFactor.value = '3';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Edita los numeros y el factor para crear un nuevo array con map().');
