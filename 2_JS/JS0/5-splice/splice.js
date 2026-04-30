/**
 * Método: splice()
 * 
 * Explicación Humana: Es la navaja suiza de los arrays. Te permite cortar una parte del array, 
 * sacar elementos y, si quieres, poner elementos nuevos en ese mismo lugar. Todo al mismo tiempo.
 * 
 * Explicación Técnica: El método splice() muta el array original. Cambia el contenido eliminando 
 * elementos existentes y/o agregando nuevos elementos. Retorna un array con los elementos eliminados.
 * Sintaxis: array.splice(indiceInicio, cantidadAEliminar, itemsAAgregar...)
 */

// Ejemplo 1: Eliminar elementos desde una posición específica
let letras = ["A", "B", "C", "D", "E"];
// Nos ubicamos en el índice 1 ("B") y eliminamos 2 elementos ("B" y "C")
letras.splice(1, 2);
console.log("1. Array de letras modificado:", letras); // Resultado: ["A", "D", "E"]

// Ejemplo 2: Insertar elementos sin eliminar nada
let nombres = ["Juan", "Pedro", "Ana"];
// Nos ubicamos en el índice 1, no eliminamos nada (0), e insertamos "Maria"
nombres.splice(1, 0, "Maria");
console.log("2. Array con inserción:", nombres); // Resultado: ["Juan", "Maria", "Pedro", "Ana"]

// Ejemplo 3: Reemplazar elementos (eliminar e insertar al mismo tiempo)
let autos = ["Ford", "Chevrolet", "Fiat", "Renault"];
// En el índice 2 ("Fiat"), eliminamos 2 elementos ("Fiat" y "Renault") y agregamos "Honda" y "Toyota"
autos.splice(2, 2, "Honda", "Toyota");
console.log("3. Array con reemplazo:", autos); // Resultado: ["Ford", "Chevrolet", "Honda", "Toyota"]
