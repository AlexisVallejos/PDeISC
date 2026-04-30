let numeros = [5, 10, 15];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-numeros" placeholder="Numeros: 5, 10, 15" value="5, 10, 15">
    <button id="btn-sumar">Sumar</button>
    <button id="btn-multiplicar">Multiplicar</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputNumeros = document.getElementById('input-numeros');
const btnSumar = document.getElementById('btn-sumar');
const btnMultiplicar = document.getElementById('btn-multiplicar');
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

function loadNumbers() {
    const valores = parseNumbers(inputNumeros.value);

    if (valores.length === 0) {
        showError('Escribi numeros separados por coma.');
        return null;
    }

    clearError();
    numeros = valores;
    render();
    return valores;
}

btnSumar.addEventListener('click', () => {
    const valores = loadNumbers();

    if (!valores) {
        return;
    }

    const total = valores.reduce((acumulador, numero) => acumulador + numero, 0);
    setOutput(`reduce() sumo los valores y dio ${total}.`);
});

btnMultiplicar.addEventListener('click', () => {
    const valores = loadNumbers();

    if (!valores) {
        return;
    }

    const total = valores.reduce((acumulador, numero) => acumulador * numero, 1);
    setOutput(`reduce() multiplico los valores y dio ${total}.`);
});

btnReset.addEventListener('click', () => {
    numeros = [5, 10, 15];
    inputNumeros.value = '5, 10, 15';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Edita los numeros y reducilos a un unico resultado.');
