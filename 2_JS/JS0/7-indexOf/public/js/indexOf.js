const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const consoleOutput = document.getElementById('console-output');

btnAction.textContent = 'Mostrar consignas resueltas';

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
    const animales = ['gato', 'perro', 'conejo'];
    const indicePerro = animales.indexOf('perro');

    const numeros = [10, 25, 50, 80];
    const indiceCincuenta = numeros.indexOf(50);
    const mensajeCincuenta = indiceCincuenta !== -1
        ? `El numero 50 esta en la posicion ${indiceCincuenta}.`
        : 'El numero 50 no esta en el array.';

    const ciudades = ['Buenos Aires', 'Roma', 'Paris'];
    const indiceMadrid = ciudades.indexOf('Madrid');
    const mensajeMadrid = indiceMadrid !== -1
        ? `Madrid esta en la posicion ${indiceMadrid}.`
        : 'Madrid no esta en el array de ciudades.';

    render([
        `perro: posicion ${indicePerro}`,
        `50: posicion ${indiceCincuenta}`,
        mensajeMadrid
    ]);

    showOutput([
        {
            consigna: 'Encuentra la posición de la palabra "perro" en un array.',
            resultado: `animales.indexOf('perro') = ${indicePerro}`
        },
        {
            consigna: 'Verifica si el número 50 está en un array y en qué posición.',
            resultado: mensajeCincuenta
        },
        {
            consigna: 'Dado un array de ciudades, muestra el índice de "Madrid" o un mensaje si no está.',
            resultado: mensajeMadrid
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
