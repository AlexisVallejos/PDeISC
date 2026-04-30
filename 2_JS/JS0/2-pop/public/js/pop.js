/**
 * Método: pop()
 * 
 * Explicación Humana: Es como sacar la última carta de la parte superior de un mazo. 
 * Elimina el último elemento que se agregó al final.
 * 
 * Explicación Técnica: El método pop() muta el array original eliminando el último elemento. 
 * Retorna el elemento que acaba de ser eliminado. Si el array está vacío, retorna undefined.
 */

// Ejemplo 1: Eliminar el último elemento
let animales = ["Perro", "Gato", "Loro"];
// Loro es el último elemento, así que será eliminado
animales.pop();
console.log("1. Array de animales:", animales); // Resultado: ["Perro", "Gato"]

// Ejemplo 2: Guardar el elemento eliminado
let compras = ["Pan", "Leche", "Huevos"];
// pop() retorna "Huevos", y lo guardamos en la variable 'eliminado'
let eliminado = compras.pop();
console.log("2. Array de compras:", compras); // Resultado: ["Pan", "Leche"]
console.log("   Producto eliminado:", eliminado); // Resultado: "Huevos"

// Ejemplo 3: Vaciar un array completamente usando pop()
let caja = ["Libro", "Lapiz", "Goma"];
// Mientras el array tenga elementos (length > 0), seguimos haciendo pop()
while (caja.length > 0) {
    caja.pop();
}
console.log("3. Caja vacía:", caja); // Resultado: []
