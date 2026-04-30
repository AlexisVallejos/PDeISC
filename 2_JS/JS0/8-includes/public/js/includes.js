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
    const roles = ['usuario', 'editor', 'admin'];
    const tieneAdmin = roles.includes('admin');

    const colores = ['rojo', 'azul', 'verde'];
    const existeVerde = colores.includes('verde');

    const numeros = [5, 10, 15];
    const numeroNuevo = 20;
    if (!numeros.includes(numeroNuevo)) {
        numeros.push(numeroNuevo);
    }

    render([
        `Contiene admin: ${tieneAdmin}`,
        `Existe verde: ${existeVerde}`,
        `Numeros: ${formatArray(numeros)}`
    ]);

    showOutput([
        {
            consigna: 'Comprueba si un array contiene la palabra "admin".',
            resultado: `roles.includes('admin') = ${tieneAdmin}`
        },
        {
            consigna: 'Dado un array de colores, indica si existe "verde".',
            resultado: `colores.includes('verde') = ${existeVerde}`
        },
        {
            consigna: 'Verifica si un número está presente antes de sumarlo al array.',
            resultado: `Como ${numeroNuevo} no estaba presente, numeros = ${formatArray(numeros)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
