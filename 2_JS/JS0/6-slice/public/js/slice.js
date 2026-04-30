let numeros = [10, 20, 30, 40, 50, 60];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="number" id="input-inicio" placeholder="Inicio" value="0">
    <input type="number" id="input-fin" placeholder="Fin" value="3">
    <input type="number" id="input-numero" placeholder="Agregar numero">
    <button id="btn-slice">Crear copia</button>
    <button id="btn-agregar">Agregar</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputInicio = document.getElementById('input-inicio');
const inputFin = document.getElementById('input-fin');
const inputNumero = document.getElementById('input-numero');
const btnSlice = document.getElementById('btn-slice');
const btnAgregar = document.getElementById('btn-agregar');
const btnReset = document.getElementById('btn-reset');

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

btnSlice.addEventListener('click', () => {
    const inicio = Number(inputInicio.value);
    const fin = inputFin.value === '' ? undefined : Number(inputFin.value);

    if (!Number.isInteger(inicio)) {
        showError('El inicio debe ser un numero entero.');
        return;
    }

    if (fin !== undefined && !Number.isInteger(fin)) {
        showError('El fin debe ser un numero entero.');
        return;
    }

    clearError();
    const copia = numeros.slice(inicio, fin);
    render(copia);
    setOutput(`slice(${inicio}${fin === undefined ? '' : ', ' + fin}) creo [${copia.join(', ')}]. Original: [${numeros.join(', ')}].`);
});

btnAgregar.addEventListener('click', () => {
    const numero = Number(inputNumero.value);

    if (!Number.isFinite(numero)) {
        showError('Escribi un numero para agregarlo.');
        return;
    }

    clearError();
    numeros.push(numero);
    inputNumero.value = '';
    render();
    setOutput(`Se agrego ${numero} al array original.`);
});

btnReset.addEventListener('click', () => {
    numeros = [10, 20, 30, 40, 50, 60];
    inputInicio.value = '0';
    inputFin.value = '3';
    inputNumero.value = '';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Elegi inicio y fin para crear una copia con slice().');
