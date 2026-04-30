let tareas = ['Estudiar', 'Practicar'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-tarea" placeholder="Nueva tarea urgente">
    <button id="btn-unshift">Agregar al inicio</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputTarea = document.getElementById('input-tarea');
const btnUnshift = document.getElementById('btn-unshift');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';
    tareas.forEach(tarea => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = tarea;
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

btnUnshift.addEventListener('click', () => {
    const tarea = inputTarea.value.trim();

    if (!tarea) {
        showError('Escribi una tarea para agregarla al inicio.');
        return;
    }

    clearError();
    const nuevaLongitud = tareas.unshift(tarea);
    inputTarea.value = '';
    render();
    setOutput(`unshift("${tarea}") agrego el elemento al principio. Nueva longitud: ${nuevaLongitud}.`);
});

inputTarea.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnUnshift.click();
    }
});

btnReset.addEventListener('click', () => {
    tareas = ['Estudiar', 'Practicar'];
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Escribi una tarea y agregala al principio del array.');
