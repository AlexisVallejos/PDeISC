/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/ejerciciosData.js
 * Rol: contiene la solucion principal de un ejercicio y puede exportar datos para usarla desde servidor o navegador.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
export function decodificarSecreto(texto) {
  return texto.replace(/\(([^()]*)\)/g, (_, bloque) => bloque.split("").reverse().join("")).replace(/\s+/g, " ").trim();
}

function pasosDecodificacion(texto) {
  const pasos = [];
  texto.replace(/\(([^()]*)\)/g, (_, bloque) => {
    pasos.push({ fragmentoOriginal: bloque, fragmentoInvertido: bloque.split("").reverse().join("") });
    return bloque;
  });
  return pasos;
}

const ejercicios = [
  {
    id: 1,
    metodo: "push",
    categoria: "mutador",
    variantes: [
      { nombre: "Agregar un elemento", arrayInicial: ["mate", "cafe"], operacion: "bebidas.push(\"te\")", codigo: "const bebidas = [\"mate\", \"cafe\"];\nbebidas.push(\"te\");", resultadoFinal: ["mate", "cafe", "te"], explicacion: "push agrega al final y modifica el array original." },
      { nombre: "Agregar varios elementos", arrayInicial: [1], operacion: "numeros.push(2, 3, 4)", codigo: "const numeros = [1];\nnumeros.push(2, 3, 4);", resultadoFinal: [1, 2, 3, 4], explicacion: "push acepta multiples argumentos en una sola llamada." },
      { nombre: "Agregar segun el ultimo valor", arrayInicial: [5, 9, 12], operacion: "si nuevo > ultimo, hacer push", codigo: "const serie = [5, 9, 12];\nconst nuevo = 15;\nif (nuevo > serie[serie.length - 1]) serie.push(nuevo);", resultadoFinal: [5, 9, 12, 15], explicacion: "Se usa una condicion para mantener una regla antes de insertar." }
    ]
  },
  { id: 2, metodo: "pop", categoria: "mutador", variantes: [
    { nombre: "Eliminar el ultimo elemento", arrayInicial: ["A", "B", "C"], operacion: "letras.pop()", codigo: "const letras = [\"A\", \"B\", \"C\"];\nletras.pop();", resultadoFinal: ["A", "B"], explicacion: "pop quita el ultimo elemento in-place." },
    { nombre: "Guardar el elemento eliminado", arrayInicial: ["pan", "leche", "huevos"], operacion: "const eliminado = compras.pop()", codigo: "const compras = [\"pan\", \"leche\", \"huevos\"];\nconst eliminado = compras.pop();", resultadoFinal: { eliminado: "huevos", array: ["pan", "leche"] }, explicacion: "pop devuelve el elemento removido para reutilizarlo." },
    { nombre: "Vaciar array con while + pop", arrayInicial: [1, 2, 3], operacion: "while (arr.length) arr.pop()", codigo: "const arr = [1, 2, 3];\nwhile (arr.length) arr.pop();", resultadoFinal: [], explicacion: "El while elimina el ultimo elemento hasta vaciarlo." }
  ]},
  { id: 3, metodo: "unshift", categoria: "mutador", variantes: [
    { nombre: "Agregar al principio", arrayInicial: ["b", "c"], operacion: "letras.unshift(\"a\")", codigo: "const letras = [\"b\", \"c\"];\nletras.unshift(\"a\");", resultadoFinal: ["a", "b", "c"], explicacion: "unshift inserta al inicio y desplaza los demas." },
    { nombre: "Agregar varios al principio", arrayInicial: ["tres"], operacion: "puestos.unshift(\"uno\", \"dos\")", codigo: "const puestos = [\"tres\"];\npuestos.unshift(\"uno\", \"dos\");", resultadoFinal: ["uno", "dos", "tres"], explicacion: "Puede recibir multiples valores en orden." },
    { nombre: "Usuario urgente/prioridad", arrayInicial: ["Lucia", "Marcos"], operacion: "cola.unshift(\"PRIORIDAD: Ana\")", codigo: "const cola = [\"Lucia\", \"Marcos\"];\ncola.unshift(\"PRIORIDAD: Ana\");", resultadoFinal: ["PRIORIDAD: Ana", "Lucia", "Marcos"], explicacion: "El usuario prioritario pasa al primer lugar." }
  ]},
  { id: 4, metodo: "shift", categoria: "mutador", variantes: [
    { nombre: "Eliminar el primer elemento", arrayInicial: [10, 20, 30], operacion: "numeros.shift()", codigo: "const numeros = [10, 20, 30];\nnumeros.shift();", resultadoFinal: [20, 30], explicacion: "shift remueve el primer elemento del array." },
    { nombre: "Guardar el eliminado", arrayInicial: ["primero", "segundo"], operacion: "const eliminado = cola.shift()", codigo: "const cola = [\"primero\", \"segundo\"];\nconst eliminado = cola.shift();", resultadoFinal: { eliminado: "primero", array: ["segundo"] }, explicacion: "El valor removido se puede usar luego." },
    { nombre: "Simular cola de atencion", arrayInicial: ["Cliente A", "Cliente B", "Cliente C"], operacion: "atender con shift en orden FIFO", codigo: "const clientes = [\"Cliente A\", \"Cliente B\", \"Cliente C\"];\nconst atendidos = [];\nwhile (clientes.length) atendidos.push(clientes.shift());", resultadoFinal: ["Cliente A", "Cliente B", "Cliente C"], explicacion: "FIFO: primero en entrar, primero en salir." }
  ]},
  { id: 5, metodo: "splice", categoria: "mutador", variantes: [
    { nombre: "Eliminar elementos", arrayInicial: ["a", "b", "c", "d"], operacion: "letras.splice(1, 2)", codigo: "const letras = [\"a\", \"b\", \"c\", \"d\"];\nconst eliminados = letras.splice(1, 2);", resultadoFinal: { eliminados: ["b", "c"], array: ["a", "d"] }, explicacion: "Elimina desde un indice y devuelve lo quitado." },
    { nombre: "Insertar sin eliminar", arrayInicial: ["Ana", "Luis"], operacion: "nombres.splice(1, 0, \"Carlos\")", codigo: "const nombres = [\"Ana\", \"Luis\"];\nnombres.splice(1, 0, \"Carlos\");", resultadoFinal: ["Ana", "Carlos", "Luis"], explicacion: "Con deleteCount=0 solo inserta." },
    { nombre: "Reemplazar elementos", arrayInicial: ["x", "y", "z", "w"], operacion: "arr.splice(1, 2, \"m\", \"n\")", codigo: "const arr = [\"x\", \"y\", \"z\", \"w\"];\narr.splice(1, 2, \"m\", \"n\");", resultadoFinal: ["x", "m", "n", "w"], explicacion: "Quita y agrega en una sola operacion." }
  ]},
  { id: 6, metodo: "slice", categoria: "no mutador", variantes: [
    { nombre: "Copiar una parte", arrayInicial: [1, 2, 3, 4, 5], operacion: "nums.slice(0, 2)", codigo: "const nums = [1, 2, 3, 4, 5];\nconst copia = nums.slice(0, 2);", resultadoFinal: [1, 2], explicacion: "Devuelve copia parcial sin modificar original." },
    { nombre: "Desde indice inicial hasta final", arrayInicial: ["A", "B", "C", "D", "E"], operacion: "letras.slice(1, 4)", codigo: "const letras = [\"A\", \"B\", \"C\", \"D\", \"E\"];\nconst tramo = letras.slice(1, 4);", resultadoFinal: ["B", "C", "D"], explicacion: "El indice final no se incluye." },
    { nombre: "Ultimos elementos sin modificar", arrayInicial: [10, 20, 30, 40], operacion: "nums.slice(-2)", codigo: "const nums = [10, 20, 30, 40];\nconst ultimos = nums.slice(-2);", resultadoFinal: [30, 40], explicacion: "Indices negativos cuentan desde el final." }
  ]},
  { id: 7, metodo: "indexOf", categoria: "busqueda", variantes: [
    { nombre: "Buscar existente", arrayInicial: ["gato", "perro", "pez"], operacion: "animales.indexOf(\"perro\")", codigo: "const animales = [\"gato\", \"perro\", \"pez\"];\nconst pos = animales.indexOf(\"perro\");", resultadoFinal: 1, explicacion: "Devuelve el primer indice encontrado." },
    { nombre: "Buscar inexistente", arrayInicial: [10, 20, 30], operacion: "numeros.indexOf(50)", codigo: "const numeros = [10, 20, 30];\nconst pos = numeros.indexOf(50);", resultadoFinal: -1, explicacion: "Si no existe, indexOf retorna -1." },
    { nombre: "Usar resultado para mensaje", arrayInicial: ["Lima", "Bogota", "Quito"], operacion: "mensaje segun indice", codigo: "const ciudades = [\"Lima\", \"Bogota\", \"Quito\"];\nconst indice = ciudades.indexOf(\"Madrid\");\nconst mensaje = indice === -1 ? \"Madrid no esta\" : `Madrid en ${indice}`;", resultadoFinal: "Madrid no esta", explicacion: "El -1 permite decidir mensajes claros al usuario." }
  ]},
  { id: 8, metodo: "includes", categoria: "busqueda", variantes: [
    { nombre: "Verificar existencia", arrayInicial: ["user", "admin", "guest"], operacion: "roles.includes(\"admin\")", codigo: "const roles = [\"user\", \"admin\", \"guest\"];\nconst esAdmin = roles.includes(\"admin\");", resultadoFinal: true, explicacion: "Retorna booleano segun exista o no el valor." },
    { nombre: "Evitar duplicados antes de agregar", arrayInicial: ["ana", "luis"], operacion: "si no existe, push", codigo: "const usuarios = [\"ana\", \"luis\"];\nconst nuevo = \"ana\";\nif (!usuarios.includes(nuevo)) usuarios.push(nuevo);", resultadoFinal: ["ana", "luis"], explicacion: "Se valida antes de insertar para no duplicar." },
    { nombre: "Validar permiso/rol", arrayInicial: ["lector", "editor"], operacion: "permisos.includes(\"admin\")", codigo: "const permisos = [\"lector\", \"editor\"];\nconst puedeBorrar = permisos.includes(\"admin\");", resultadoFinal: false, explicacion: "Sirve para habilitar o bloquear acciones por rol." }
  ]},
  { id: 9, metodo: "forEach", categoria: "iteracion", variantes: [
    { nombre: "Recorrer nombres", arrayInicial: ["Ana", "Luis"], operacion: "forEach para armar saludos", codigo: "const nombres = [\"Ana\", \"Luis\"];\nconst saludos = [];\nnombres.forEach((n) => saludos.push(`Hola ${n}`));", resultadoFinal: ["Hola Ana", "Hola Luis"], explicacion: "forEach recorre y suele usarse con efectos secundarios." },
    { nombre: "Recorrer numeros y mostrar doble", arrayInicial: [2, 4, 6], operacion: "forEach con acumulador externo", codigo: "const nums = [2, 4, 6];\nconst dobles = [];\nnums.forEach((n) => dobles.push(n * 2));", resultadoFinal: [4, 8, 12], explicacion: "No crea nuevo array automaticamente como map." },
    { nombre: "Recorrer objetos", arrayInicial: [{ nombre: "Ana", edad: 20 }, { nombre: "Leo", edad: 25 }], operacion: "forEach para formatear texto", codigo: "const personas = [{ nombre: \"Ana\", edad: 20 }, { nombre: \"Leo\", edad: 25 }];\nconst mensajes = [];\npersonas.forEach((p) => mensajes.push(`${p.nombre} tiene ${p.edad}`));", resultadoFinal: ["Ana tiene 20", "Leo tiene 25"], explicacion: "Ideal para imprimir, loggear o preparar vistas." }
  ]},
  { id: 10, metodo: "map", categoria: "transformacion", variantes: [
    { nombre: "Transformar numeros", arrayInicial: [1, 2, 3], operacion: "numeros.map(n => n * 3)", codigo: "const numeros = [1, 2, 3];\nconst triples = numeros.map((n) => n * 3);", resultadoFinal: [3, 6, 9], explicacion: "map retorna un array nuevo transformado." },
    { nombre: "Transformar strings", arrayInicial: ["ana", "leo"], operacion: "nombres.map(n => n.toUpperCase())", codigo: "const nombres = [\"ana\", \"leo\"];\nconst mayus = nombres.map((n) => n.toUpperCase());", resultadoFinal: ["ANA", "LEO"], explicacion: "Cada elemento se transforma y se conserva el largo." },
    { nombre: "Precios con IVA", arrayInicial: [100, 200], operacion: "precios.map(p => +(p * 1.21).toFixed(2))", codigo: "const precios = [100, 200];\nconst conIva = precios.map((p) => +(p * 1.21).toFixed(2));", resultadoFinal: [121, 242], explicacion: "Se aplica la formula a cada precio sin mutar original." }
  ]},
  { id: 11, metodo: "filter", categoria: "transformacion", variantes: [
    { nombre: "Filtrar numeros", arrayInicial: [4, 11, 20, 8], operacion: "numeros.filter(n => n > 10)", codigo: "const numeros = [4, 11, 20, 8];\nconst mayores = numeros.filter((n) => n > 10);", resultadoFinal: [11, 20], explicacion: "Conserva solo los que cumplen la condicion." },
    { nombre: "Filtrar palabras", arrayInicial: ["sol", "montana", "casa", "escuela"], operacion: "palabras.filter(p => p.length > 5)", codigo: "const palabras = [\"sol\", \"montana\", \"casa\", \"escuela\"];\nconst largas = palabras.filter((p) => p.length > 5);", resultadoFinal: ["montana", "escuela"], explicacion: "La condicion se evalua por cada item." },
    { nombre: "Filtrar objetos activos", arrayInicial: [{ nombre: "Ana", activo: true }, { nombre: "Luis", activo: false }], operacion: "usuarios.filter(u => u.activo)", codigo: "const usuarios = [{ nombre: \"Ana\", activo: true }, { nombre: \"Luis\", activo: false }];\nconst activos = usuarios.filter((u) => u.activo);", resultadoFinal: [{ nombre: "Ana", activo: true }], explicacion: "Funciona muy bien con propiedades booleanas." }
  ]},
  { id: 12, metodo: "reduce", categoria: "transformacion", variantes: [
    { nombre: "Sumar", arrayInicial: [1, 2, 3, 4], operacion: "nums.reduce((acc, n) => acc + n, 0)", codigo: "const nums = [1, 2, 3, 4];\nconst total = nums.reduce((acc, n) => acc + n, 0);", resultadoFinal: 10, explicacion: "reduce acumula todo en un unico valor final." },
    { nombre: "Multiplicar", arrayInicial: [2, 3, 4], operacion: "nums.reduce((acc, n) => acc * n, 1)", codigo: "const nums = [2, 3, 4];\nconst producto = nums.reduce((acc, n) => acc * n, 1);", resultadoFinal: 24, explicacion: "Para producto el acumulador inicia en 1." },
    { nombre: "Acumular precios de objetos", arrayInicial: [{ precio: 10 }, { precio: 25.5 }, { precio: 4.5 }], operacion: "items.reduce((acc, i) => acc + i.precio, 0)", codigo: "const items = [{ precio: 10 }, { precio: 25.5 }, { precio: 4.5 }];\nconst total = items.reduce((acc, i) => acc + i.precio, 0);", resultadoFinal: 40, explicacion: "Suma una propiedad puntual de cada objeto." }
  ]},
  { id: 13, metodo: "sort", categoria: "transformacion", variantes: [
    { nombre: "Ordenar numeros", arrayInicial: [40, 5, 100, 2], operacion: "nums.sort((a, b) => a - b)", codigo: "const nums = [40, 5, 100, 2];\nnums.sort((a, b) => a - b);", resultadoFinal: [2, 5, 40, 100], explicacion: "Comparador numerico evita orden alfabetico." },
    { nombre: "Ordenar palabras", arrayInicial: ["pera", "banana", "manzana"], operacion: "palabras.sort()", codigo: "const palabras = [\"pera\", \"banana\", \"manzana\"];\npalabras.sort();", resultadoFinal: ["banana", "manzana", "pera"], explicacion: "Sin comparador, ordena texto lexicograficamente." },
    { nombre: "Ordenar objetos por edad", arrayInicial: [{ nombre: "Ana", edad: 30 }, { nombre: "Luis", edad: 22 }], operacion: "personas.sort((a, b) => a.edad - b.edad)", codigo: "const personas = [{ nombre: \"Ana\", edad: 30 }, { nombre: \"Luis\", edad: 22 }];\npersonas.sort((a, b) => a.edad - b.edad);", resultadoFinal: [{ nombre: "Luis", edad: 22 }, { nombre: "Ana", edad: 30 }], explicacion: "Se define el criterio con una propiedad numerica." }
  ]},
  { id: 14, metodo: "reverse", categoria: "mutador", variantes: [
    { nombre: "Invertir array", arrayInicial: ["a", "b", "c"], operacion: "letras.reverse()", codigo: "const letras = [\"a\", \"b\", \"c\"];\nletras.reverse();", resultadoFinal: ["c", "b", "a"], explicacion: "reverse invierte el array en el mismo lugar." },
    { nombre: "Invertir numeros", arrayInicial: [1, 2, 3, 4], operacion: "numeros.reverse()", codigo: "const numeros = [1, 2, 3, 4];\nnumeros.reverse();", resultadoFinal: [4, 3, 2, 1], explicacion: "El ultimo valor pasa al inicio." },
    { nombre: "Invertir string con split + reverse + join", arrayInicial: "Hola mundo", operacion: "texto.split('').reverse().join('')", codigo: "const texto = \"Hola mundo\";\nconst invertido = texto.split(\"\").reverse().join(\"\");", resultadoFinal: "odnum aloH", explicacion: "Se convierte el string a array temporal para invertir." }
  ]},
  { id: 15, metodo: "secreto", categoria: "especial", variantes: [
    { nombre: "Decodificar mensaje fijo", arrayInicial: ["Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo."], operacion: "decodificarSecreto(mensajeFijo)", codigo: "const mensaje = \"Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.\";\nconst salida = decodificarSecreto(mensaje);", resultadoFinal: "Hoy a las 22 hs. nos reunimos en casa de Marcelo.", explicacion: "Cada bloque entre parentesis se invierte en forma independiente." },
    { nombre: "Ingresar mensaje propio", arrayInicial: ["Nos vemos (anecham)"], operacion: "decodificarSecreto(mensajeIngresado)", codigo: "const mensajeIngresado = \"Nos vemos (anecham)\";\nconst salida = decodificarSecreto(mensajeIngresado);", resultadoFinal: "Nos vemos mechana", explicacion: "La misma funcion sirve para cualquier string con bloques." },
    { nombre: "Mostrar paso a paso", arrayInicial: ["Clave (oterc es) y punto (lanif)"], operacion: "extraer bloques y mostrar su inversion", codigo: "const texto = \"Clave (oterc es) y punto (lanif)\";\nconst pasos = pasosDecodificacion(texto);\nconst final = decodificarSecreto(texto);", resultadoFinal: { pasos: [{ fragmentoOriginal: "oterc es", fragmentoInvertido: "se creto" }, { fragmentoOriginal: "lanif", fragmentoInvertido: "final" }], salida: "Clave se creto y punto final" }, explicacion: "Se visualiza cada fragmento original y su version invertida." }
  ]}
];

// getExerciseByMethod: Obtiene y devuelve informacion sin modificar el estado principal.
export function getExerciseByMethod(metodo) {
  const found = ejercicios.find((ej) => ej.metodo === metodo);
  if (!found) throw new Error(`Metodo no encontrado: ${metodo}`);
  return structuredClone(found);
}

// getAllExercises: Obtiene y devuelve informacion sin modificar el estado principal.
export function getAllExercises() {
  return structuredClone(ejercicios);
}

// getSecretoApi: Obtiene y devuelve informacion sin modificar el estado principal.
export function getSecretoApi() {
  const fijo = ejercicios.find((ej) => ej.metodo === "secreto")?.variantes?.[0]?.arrayInicial?.[0] || "";
  return { entrada: fijo, salida: decodificarSecreto(fijo), pasos: pasosDecodificacion(fijo) };
}
