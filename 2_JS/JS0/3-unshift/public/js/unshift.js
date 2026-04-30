/**
 * Método: unshift()
 * 
 * Explicación Humana: Es como colarse en el primer lugar de la fila del supermercado. 
 * Agrega elementos al principio de la lista, empujando los demás hacia atrás.
 * 
 * Explicación Técnica: El método unshift() muta el array original insertando uno o más 
 * elementos al inicio (índice 0). Esto desplaza los índices de los elementos existentes 
 * y retorna la nueva longitud del array.
 */

// Ejemplo 1: Insertar elementos al principio
let colores = [];
// Agregamos tres colores al inicio del array vacío
colores.unshift("Rojo", "Azul", "Verde");
console.log("1. Array de colores:", colores); // Resultado: ["Rojo", "Azul", "Verde"]

// Ejemplo 2: Priorizar un elemento en una lista existente
let tareas = ["Lavar ropa", "Cocinar"];
// Agregamos una tarea urgente en la primera posición
tareas.unshift("TAREA URGENTE: Pagar la luz");
console.log("2. Array de tareas:", tareas); // Resultado: ["TAREA URGENTE: Pagar la luz", "Lavar ropa", "Cocinar"]

// Ejemplo 3: Agregar un nuevo usuario al registro histórico
let usuariosConectados = ["admin", "moderador"];
// El nuevo usuario entra de primero a la lista
usuariosConectados.unshift("nuevo_usuario");
console.log("3. Usuarios conectados:", usuariosConectados); // Resultado: ["nuevo_usuario", "admin", "moderador"]
