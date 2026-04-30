/**
 * Método: includes()
 * 
 * Explicación Humana: Es una pregunta de sí o no. "¿Tienes la palabra 'admin' en esta lista?". 
 * Te responde simplemente con verdadero o falso.
 * 
 * Explicación Técnica: Determina si un array incluye un determinado elemento, retornando 
 * true o false según corresponda. Es ideal para condiciones booleanas simples.
 */

// Ejemplo 1: Comprobar existencia en un array de strings
let roles = ["usuario", "editor", "admin"];
// Preguntamos si el string "admin" está incluido
let tieneAdmin = roles.includes("admin");
console.log("1. ¿El rol es administrador?:", tieneAdmin); // Resultado: true

// Ejemplo 2: Cuando el elemento no existe
let colores = ["rojo", "azul", "amarillo"];
// Buscamos "verde", que no está
let tieneVerde = colores.includes("verde");
console.log("2. ¿La lista incluye verde?:", tieneVerde); // Resultado: false

// Ejemplo 3: Uso práctico para evitar duplicados al agregar
let numeros = [1, 2, 3, 4];
let nuevoNumero = 3;

// Si el array NO incluye el número, lo agregamos
if (!numeros.includes(nuevoNumero)) {
    numeros.push(nuevoNumero);
} else {
    // Como el 3 ya está, entramos a este bloque
    console.log("3. El número", nuevoNumero, "ya está en la lista.");
}
console.log("   Array resultante:", numeros);
