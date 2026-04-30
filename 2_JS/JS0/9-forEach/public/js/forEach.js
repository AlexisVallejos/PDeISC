let nombres = ['Ana', 'Luis', 'Sofia'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-nombre" placeholder="Nuevo nombre">
    <button id="btn-agregar">Agregar nombre</button>
    <button id="btn-saludar">Saludar con forEach()</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputNombre = document.getElementById('input-nombre');
const btnAgregar = document.getElementById('btn-agregar');
const btnSaludar = document.getElementById('btn-saludar');
const btnReset = document.getElementById('btn-reset');

function render(items = nombres) {
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

btnAgregar.addEventListener('click', () => {
    const nombre = inputNombre.value.trim();

    if (!nombre) {
        showError('Escribi un nombre para agregarlo.');
        return;
    }

    clearError();
    nombres.push(nombre);
    inputNombre.value = '';
    render();
    setOutput(`Se agrego "${nombre}" al array.`);
});

inputNombre.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnAgregar.click();
    }
});

btnSaludar.addEventListener('click', () => {
    const saludos = [];

    nombres.forEach(nombre => {
        saludos.push(`Hola, ${nombre}`);
    });

    render(saludos);
    clearError();
    setOutput(`forEach() recorrio ${nombres.length} nombres.`);
});

btnReset.addEventListener('click', () => {
    nombres = ['Ana', 'Luis', 'Sofia'];
    inputNombre.value = '';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Agrega nombres y recorrelos con forEach().');
