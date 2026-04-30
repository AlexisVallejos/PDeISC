function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let enteros = [10, 20, 30];
let eliminado = enteros.shift();
return `Eliminado: ${eliminado} | Quedan: [${enteros.join(', ')}]`;
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let mensajes = ['Hola', '¿Cómo estás?', 'Bien'];
let eliminado = mensajes.shift();
return `Eliminado: ${eliminado} | Quedan: [${mensajes.join(', ')}]`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let cola = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
let atendido = cola.shift();
return `Atendiendo a: ${atendido} | Quedan en cola: [${cola.join(', ')}]`;
        };
        showResult('display-3', execute());
    } catch(e) {
        showResult('display-3', 'Error: ' + e.message);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    showResult('display-1', 'Interacción lista: usa clic o teclas 1, 2 y 3.');
});

document.addEventListener('keydown', (event) => {
    if (event.key === '1') document.getElementById('btn-1').click();
    if (event.key === '2') document.getElementById('btn-2').click();
    if (event.key === '3') document.getElementById('btn-3').click();
});
