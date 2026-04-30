/**
 * Archivo didáctico del método pop.
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
            let animales = ['Perro', 'Gato', 'León', 'Tigre'];
let eliminado = animales.pop();
return `Eliminado: ${eliminado} | Quedan: [${animales.join(', ')}]`;
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
            let compras = ['Pan', 'Leche', 'Huevos', 'Manteca'];
let eliminado = compras.pop();
return `Eliminado: ${eliminado} | Quedan: [${compras.join(', ')}]`;
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
            let arrayParaVaciar = [1, 2, 3, 4, 5];
let pasos = [];
while(arrayParaVaciar.length > 0) {
    pasos.push(arrayParaVaciar.pop());
}
return `Elementos sacados: [${pasos.join(', ')}] | Array final: [${arrayParaVaciar.join(', ')}]`;
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
