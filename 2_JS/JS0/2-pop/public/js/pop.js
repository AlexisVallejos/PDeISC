function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

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

