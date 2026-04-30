let array = ['Manzana', 'Banana'];
const container = document.getElementById('array-container');
const inputVal = document.getElementById('input-val');
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
    const val = inputVal.value.trim();
    if (!val) {
        inputVal.classList.add('error');
        errorMsg.textContent = 'El valor no puede estar vacío';
        errorMsg.classList.add('show');
        return;
    }
    inputVal.classList.remove('error');
    errorMsg.classList.remove('show');
    const newLen = array.push(val);
    inputVal.value = '';
    render();
    consoleOutput.innerHTML = `Se ejecutó array.push("${val}"). Nueva longitud: ${newLen}`;
});
render();