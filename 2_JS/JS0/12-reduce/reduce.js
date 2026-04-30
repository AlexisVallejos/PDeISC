/**
 * Método: reduce()
 * 
 * Explicación Humana: Es como meter todos los ingredientes de una receta en una licuadora. 
 * Pasas una lista entera de cosas y las comprimes (o "reduces") para obtener un único resultado final, 
 * como un total, un promedio o un texto combinado.
 * 
 * Explicación Técnica: Ejecuta una función reductora sobre cada elemento de un array, 
 * devolviendo como resultado un único valor. Requiere un 'acumulador' que guarda el resultado 
 * de la iteración anterior, y un 'valor actual' que representa el elemento actual del array.
 * Sintaxis: array.reduce((acumulador, elementoActual) => { ... }, valorInicial)
 */

// Ejemplo 1: Sumar todos los elementos
let numeros = [10, 20, 30, 40];
// El 0 final es el valor inicial del acumulador. 
// En cada paso: acumulador = acumulador + num
let sumaTotal = numeros.reduce((acumulador, num) => acumulador + num, 0);
console.log("1. Suma de todos los números:", sumaTotal); // Resultado: 100

// Ejemplo 2: Multiplicar todos los elementos
let enteros = [2, 3, 4];
// Aquí el valor inicial debe ser 1 (si fuera 0, toda multiplicación daría 0)
let productoTotal = enteros.reduce((acumulador, num) => acumulador * num, 1);
console.log("2. Producto de los elementos:", productoTotal); // Resultado: 24 (2*3*4)

// Ejemplo 3: Reducir un array de objetos (ej. total de un carrito de compras)
let carrito = [
    { producto: "Teclado", precio: 100 },
    { producto: "Monitor", precio: 250 },
    { producto: "Mouse", precio: 50 }
];
// Extraemos la propiedad 'precio' de cada objeto iterado (item) y la sumamos al acumulador
let totalCarrito = carrito.reduce((acumulador, item) => acumulador + item.precio, 0);
console.log("3. Valor total a pagar del carrito:", totalCarrito); // Resultado: 400
