let valores = ['40', '5', '100', '12'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-valores" placeholder="Valores separados por coma" value="40, 5, 100, 12">
    <button id="btn-numeros">Ordenar numeros</button>
    <button id="btn-texto">Ordenar texto</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputValores = document.getElementById('input-valores');
const btnNumeros = document.getElementById('btn-numeros');
const btnTexto = document.getElementById('btn-texto');
const btnReset = document.getElementById('btn-reset');

function parseValues(value) {
    return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

function render(items = valores) {
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

btnNumeros.addEventListener('click', () => {
    const cargados = parseValues(inputValores.value);
    const numeros = cargados.map(valor => Number(valor));

    if (numeros.length === 0 || numeros.some(numero => !Number.isFinite(numero))) {
        showError('Para ordenar numeros, todos los valores deben ser numericos.');
        return;
    }

    clearError();
    numeros.sort((a, b) => a - b);
    valores = numeros.map(String);
    render(valores);
    setOutput(`sort((a, b) => a - b) ordeno [${valores.join(', ')}].`);
});

btnTexto.addEventListener('click', () => {
    const cargados = parseValues(inputValores.value);

    if (cargados.length === 0) {
        showError('Escribi valores separados por coma.');
        return;
    }

    clearError();
    valores = cargados.sort((a, b) => a.localeCompare(b));
    render();
    setOutput(`sort() ordeno alfabeticamente [${valores.join(', ')}].`);
});

btnReset.addEventListener('click', () => {
    valores = ['40', '5', '100', '12'];
    inputValores.value = '40, 5, 100, 12';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Carga valores y elegi si queres ordenarlos como numeros o texto.');
