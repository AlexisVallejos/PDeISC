let array = ['Manzana', 'Banana', 'Uva'];
const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');
function render() {
    container.innerHTML = '';
    array.forEach(item => {
        let div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = item;
        container.appendChild(div);
    });
}
btnAction.addEventListener('click', () => {
    if (array.length === 0) {
        errorMsg.textContent = 'El array ya está vacío';
        errorMsg.classList.add('show');
        return;
    }
    errorMsg.classList.remove('show');
    const removed = array.pop();
    render();
    consoleOutput.innerHTML = `Se ejecutó array.pop(). Elemento eliminado: ${removed}`;
});
render();