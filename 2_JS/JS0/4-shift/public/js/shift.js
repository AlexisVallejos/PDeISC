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
    const enteros = [10, 20, 30, 40];
    const numeroQuitado = enteros.shift();

    const mensajesChat = ['Hola', 'Como estas?', 'Nos vemos'];
    const mensajeEliminado = mensajesChat.shift();

    const colaClientes = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
    const clientesAtendidos = [];
    while (colaClientes.length > 0) {
        clientesAtendidos.push(colaClientes.shift());
    }

    render([
        `Enteros: ${formatArray(enteros)}`,
        `Mensajes: ${formatArray(mensajesChat)}`,
        `Cola final: ${formatArray(colaClientes)}`
    ]);

    showOutput([
        {
            consigna: 'Quita el primer número de un array de enteros.',
            resultado: `Numero quitado: ${numeroQuitado}; enteros = ${formatArray(enteros)}`
        },
        {
            consigna: 'Elimina el primer mensaje de un array de mensajes de chat.',
            resultado: `Mensaje eliminado: ${mensajeEliminado}; mensajesChat = ${formatArray(mensajesChat)}`
        },
        {
            consigna: 'Usa shift() para simular una cola de atención al cliente.',
            resultado: `Clientes atendidos: ${formatArray(clientesAtendidos)}; colaClientes = ${formatArray(colaClientes)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
