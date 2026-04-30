let array = [1, 2, 3, 4, 5];
const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const consoleOutput = document.getElementById('console-output');
function render(arr) {
    container.innerHTML = '';
    arr.forEach(item => {
        let div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = item;
        container.appendChild(div);
    });
}
btnAction.addEventListener('click', () => {
    let res = [...array].reverse();
    if ('map' === 'sort') res = [...array].sort((a,b)=>b-a);
    if ('map' === 'map') res = array.map(x => x*2);
    if ('map' === 'filter') res = array.filter(x => x>2);
    render(res);
    consoleOutput.innerHTML = `Se ejecutó map(). Observa el resultado.`;
});
render(array);