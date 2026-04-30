const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const consoleOutput = document.getElementById('console-output');

btnAction.textContent = 'Mostrar consignas resueltas';

function formatArray(array) {
    return `[${array.map(item => String(item)).join(', ')}]`;
}

function render(items) {
    container.innerHTML = '';
    items.forEach(item => {
        let div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = item;
        container.appendChild(div);
    });
}

function showOutput(exercises) {
    consoleOutput.innerHTML = exercises.map((exercise, index) => (
        `<p><strong>${index + 1}. ${exercise.consigna}</strong><br>${exercise.resultado}</p>`
    )).join('');
}

function runExercises() {
    const colores = [];
    colores.unshift('Rojo');
    colores.unshift('Verde');
    colores.unshift('Azul');

    const tareas = ['Estudiar JavaScript', 'Practicar arrays'];
    tareas.unshift('Entregar tarea urgente');

    const usuariosConectados = ['Lucia', 'Pedro'];
    usuariosConectados.unshift('Camila');

    render([
        `Colores: ${formatArray(colores)}`,
        `Tareas: ${formatArray(tareas)}`,
        `Usuarios conectados: ${formatArray(usuariosConectados)}`
    ]);

    showOutput([
        {
            consigna: 'Agrega tres colores al principio de un array vacío.',
            resultado: `colores = ${formatArray(colores)}`
        },
        {
            consigna: 'Dado un array de tareas, agrega una nueva tarea urgente al principio.',
            resultado: `tareas = ${formatArray(tareas)}`
        },
        {
            consigna: 'Inserta el nombre de un usuario al principio de un array de usuarios conectados.',
            resultado: `usuariosConectados = ${formatArray(usuariosConectados)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
