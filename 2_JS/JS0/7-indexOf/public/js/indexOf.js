/**
 * Método: indexOf()
 * 
 * Explicación Humana: Es como buscar una palabra en un diccionario. Le pasas lo que buscas 
 * y te dice en qué número de página (posición) lo encontró por primera vez. Si no está, te avisa.
 * 
 * Explicación Técnica: Retorna el primer índice en el que se puede encontrar un elemento dado 
 * en el array. Si el elemento no existe, retorna -1. Hace una comparación estricta (===).
 */

// Ejemplo 1: Encontrar la posición exacta de un elemento
let mascotas = ["gato", "loro", "perro", "conejo"];
// Buscamos "perro", el cual está en la posición 2
let posicionPerro = mascotas.indexOf("perro");
console.log("1. Posición de perro:", posicionPerro); // Resultado: 2

// Ejemplo 2: Buscar un número
let numeros = [10, 20, 30, 40, 50, 60];
// Buscamos el número 50
let posicion50 = numeros.indexOf(50);
console.log("2. Posición del número 50:", posicion50); // Resultado: 4

// Ejemplo 3: Lógica condicional basada en la existencia (verificando -1)
let ciudades = ["Roma", "Paris", "Londres"];
let indiceMadrid = ciudades.indexOf("Madrid");

// Si indexOf retorna algo distinto a -1, significa que lo encontró
if (indiceMadrid !== -1) {
    console.log("3. Madrid está en el índice:", indiceMadrid);
} else {
    // Si retorna -1, el elemento no existe en el array
    console.log("3. Madrid no se encuentra en el array.");
}
