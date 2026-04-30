let letras = ['A', 'B', 'C', 'D'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-valores" placeholder="Texto o valores separados por coma" value="A, B, C, D">
    <button id="btn-array">Invertir array</button>
    <button id="btn-texto">Invertir texto</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputValores = document.getElementById('input-valores');
const btnArray = document.getElementById('btn-array');
const btnTexto = document.getElementById('btn-texto');
const btnReset = document.getElementById('btn-reset');

function render(items = letras) {
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

function parseValues(value) {
    return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

btnArray.addEventListener('click', () => {
    const valores = parseValues(inputValores.value);

    if (valores.length === 0) {
        showError('Escribi valores separados por coma.');
        return;
    }

    clearError();
    letras = valores;
    letras.reverse();
    render();
    setOutput(`reverse() invirtio el array: [${letras.join(', ')}].`);
});

btnTexto.addEventListener('click', () => {
    const texto = inputValores.value;

    if (!texto.trim()) {
        showError('Escribi un texto para invertirlo.');
        return;
    }

    clearError();
    const invertido = texto.split('').reverse().join('');
    render([invertido]);
    setOutput(`El texto invertido es: ${invertido}`);
});

btnReset.addEventListener('click', () => {
    letras = ['A', 'B', 'C', 'D'];
    inputValores.value = 'A, B, C, D';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Carga valores o texto para invertirlos.');
