/**
 * Archivo didáctico del método indexOf.
 *
 * Este script conecta los botones de la interfaz con la ejecución de cada consigna.
 * - Cada botón (#btn-1, #btn-2, #btn-3) ejecuta un ejercicio independiente.
 * - showResult(...) renderiza el resultado textual en pantalla con una animación breve.
 * - También hay eventos de teclado para ejecutar con teclas 1, 2 y 3.
 */

/**
 * Muestra el resultado en el contenedor indicado.
 * @param {string} elementId - id del nodo de salida (display-1/2/3).
 * @param {string} result - texto final a mostrar al usuario.
 */

function smartValue(token) {
    const clean = token.trim();
    if (clean === '') return clean;
    const n = Number(clean);
    return Number.isNaN(n) ? clean : n;
}

function getUserArray(message, fallback) {
    const raw = prompt(message);
    if (!raw || !raw.trim()) return [...fallback];
    return raw.split(',').map(smartValue);
}

function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

// Evento click: ejecuta la consigna 1 del proyecto.
document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let mascotas = getUserArray('Ingresá valores separados por coma:', ['gato', 'loro', 'perro', 'pez']);
let posPerro = mascotas.indexOf('perro');
return `Posición de perro: ${posPerro}`;
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

// Evento click: ejecuta la consigna 2 del proyecto.
document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let numBusqueda = getUserArray('Ingresá valores separados por coma:', [10, 20, 50, 40]);
let pos50 = numBusqueda.indexOf(50);
return `Posición del 50: ${pos50}`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

// Evento click: ejecuta la consigna 3 del proyecto.
document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let ciudades = getUserArray('Ingresá valores separados por coma:', ['Barcelona', 'Valencia', 'Sevilla']);
let posMadrid = ciudades.indexOf('Madrid');
return posMadrid !== -1 ? `Índice de Madrid: ${posMadrid}` : 'Madrid no está en el array';
        };
        showResult('display-3', execute());
    } catch(e) {
        showResult('display-3', 'Error: ' + e.message);
    }
});


// Evento DOMContentLoaded: informa al usuario que la pantalla está lista.
document.addEventListener('DOMContentLoaded', () => {
    showResult('display-1', 'Interacción lista: usa clic o teclas 1, 2 y 3.');
});

// Evento keydown: habilita accesos rápidos con teclado (1, 2, 3).
document.addEventListener('keydown', (event) => {
    if (event.key === '1') document.getElementById('btn-1').click();
    if (event.key === '2') document.getElementById('btn-2').click();
    if (event.key === '3') document.getElementById('btn-3').click();
});
