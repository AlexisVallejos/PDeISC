function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let nums = [1, 2, 3, 4, 5];
let res = nums.reduce((acc, curr) => acc + curr, 0);
return `Suma total: ${res}`;
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let nums = [1, 2, 3, 4, 5];
let res = nums.reduce((acc, curr) => acc * curr, 1);
return `Multiplicación: ${res}`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let carrito = [{precio: 10}, {precio: 20}, {precio: 30}];
let res = carrito.reduce((acc, curr) => acc + curr.precio, 0);
return `Total Carrito: ${res}`;
        };
        showResult('display-3', execute());
    } catch(e) {
        showResult('display-3', 'Error: ' + e.message);
    }
});

