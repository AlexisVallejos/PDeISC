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
    const numeros = [1, 2, 3, 4, 5, 6];
    const primerosTres = numeros.slice(0, 3);

    const peliculas = ['Matrix', 'Avatar', 'Titanic', 'Gladiador', 'Rocky', 'Shrek'];
    const copiaParcial = peliculas.slice(2, 5);

    const elementos = ['A', 'B', 'C', 'D', 'E', 'F'];
    const ultimosTres = elementos.slice(-3);

    render([
        `Primeros 3: ${formatArray(primerosTres)}`,
        `Peliculas 2 a 4: ${formatArray(copiaParcial)}`,
        `Ultimos 3: ${formatArray(ultimosTres)}`
    ]);

    showOutput([
        {
            consigna: 'Copia los primeros 3 elementos de un array de números.',
            resultado: `numeros original = ${formatArray(numeros)}; copia = ${formatArray(primerosTres)}`
        },
        {
            consigna: 'Crea una copia parcial de un array de películas desde la posición 2 hasta la 4.',
            resultado: `peliculas original = ${formatArray(peliculas)}; copiaParcial = ${formatArray(copiaParcial)}`
        },
        {
            consigna: 'Crea un array nuevo con los últimos 3 elementos sin modificarlos.',
            resultado: `elementos original = ${formatArray(elementos)}; ultimosTres = ${formatArray(ultimosTres)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
