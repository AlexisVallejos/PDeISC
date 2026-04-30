let elementos = ['A', 'B', 'C', 'D', 'E'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="number" id="input-inicio" placeholder="Posicion" min="0" value="1">
    <input type="number" id="input-cantidad" placeholder="Eliminar" min="0" value="1">
    <input type="text" id="input-nuevos" placeholder="Nuevos: X, Y">
    <button id="btn-splice">Aplicar splice()</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputInicio = document.getElementById('input-inicio');
const inputCantidad = document.getElementById('input-cantidad');
const inputNuevos = document.getElementById('input-nuevos');
const btnSplice = document.getElementById('btn-splice');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';

    if (elementos.length === 0) {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = 'Array vacio';
        container.appendChild(div);
        return;
    }

    elementos.forEach(elemento => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = elemento;
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

function parseNewItems(value) {
    return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

btnSplice.addEventListener('click', () => {
    const inicio = Number(inputInicio.value);
    const cantidad = Number(inputCantidad.value);
    const nuevos = parseNewItems(inputNuevos.value);

    if (!Number.isInteger(inicio) || inicio < 0 || inicio > elementos.length) {
        showError(`La posicion debe estar entre 0 y ${elementos.length}.`);
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 0) {
        showError('La cantidad a eliminar debe ser 0 o mayor.');
        return;
    }

    clearError();
    const eliminados = elementos.splice(inicio, cantidad, ...nuevos);
    render();
    setOutput(`splice(${inicio}, ${cantidad}${nuevos.length ? ', ' + nuevos.join(', ') : ''}) elimino [${eliminados.join(', ')}].`);
});

btnReset.addEventListener('click', () => {
    elementos = ['A', 'B', 'C', 'D', 'E'];
    inputInicio.value = '1';
    inputCantidad.value = '1';
    inputNuevos.value = '';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Elegi posicion, cantidad y valores nuevos para modificar el array.');
