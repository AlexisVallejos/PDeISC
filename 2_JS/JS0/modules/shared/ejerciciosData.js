export function decodificarSecreto(texto) {
  return texto.replace(/\(([^()]*)\)/g, (_, bloque) => bloque.split("").reverse().join("")).replace(/\s+/g, " ").trim();
}

function pasosDecodificación(texto) {
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
    método: "push",
    categoria: "mutador",
    variantes: [
      { nombre: "Agregar un elemento", arrayInicial: ["mate", "cafe"], operación: "bebidas.push(\"te\")", código: "const bebidas = [\"mate\", \"cafe\"];\nbebidas.push(\"te\");", resultadoFinal: ["mate", "cafe", "te"], explicacion: "push agrega al final y modifica el array original." },
      { nombre: "Agregar varios elementos", arrayInicial: [1], operación: "números.push(2, 3, 4)", código: "const números = [1];\nnúmeros.push(2, 3, 4);", resultadoFinal: [1, 2, 3, 4], explicacion: "push acepta multiples argumentos en una sola llamada." },
      { nombre: "Agregar segun el ultimo valor", arrayInicial: [5, 9, 12], operación: "si nuevo > ultimo, hacer push", código: "const serie = [5, 9, 12];\nconst nuevo = 15;\nif (nuevo > serie[serie.length - 1]) serie.push(nuevo);", resultadoFinal: [5, 9, 12, 15], explicacion: "Se usa una condicion para mantener una regla antes de insertar." }
    ]
  },
  { id: 2, método: "pop", categoria: "mutador", variantes: [
    { nombre: "Eliminar el ultimo elemento", arrayInicial: ["A", "B", "C"], operación: "letras.pop()", código: "const letras = [\"A\", \"B\", \"C\"];\nletras.pop();", resultadoFinal: ["A", "B"], explicacion: "pop quita el ultimo elemento in-place." },
    { nombre: "Guardar el elemento eliminado", arrayInicial: ["pan", "leche", "huevos"], operación: "const eliminado = compras.pop()", código: "const compras = [\"pan\", \"leche\", \"huevos\"];\nconst eliminado = compras.pop();", resultadoFinal: { eliminado: "huevos", array: ["pan", "leche"] }, explicacion: "pop devuelve el elemento removido para reutilizarlo." },
    { nombre: "Vaciar array con while + pop", arrayInicial: [1, 2, 3], operación: "while (arr.length) arr.pop()", código: "const arr = [1, 2, 3];\nwhile (arr.length) arr.pop();", resultadoFinal: [], explicacion: "El while elimina el ultimo elemento hasta vaciarlo." }
  ]},
  { id: 3, método: "unshift", categoria: "mutador", variantes: [
    { nombre: "Agregar al principio", arrayInicial: ["b", "c"], operación: "letras.unshift(\"a\")", código: "const letras = [\"b\", \"c\"];\nletras.unshift(\"a\");", resultadoFinal: ["a", "b", "c"], explicacion: "unshift inserta al inicio y desplaza los demas." },
    { nombre: "Agregar varios al principio", arrayInicial: ["tres"], operación: "puestos.unshift(\"uno\", \"dos\")", código: "const puestos = [\"tres\"];\npuestos.unshift(\"uno\", \"dos\");", resultadoFinal: ["uno", "dos", "tres"], explicacion: "Puede recibir multiples valores en orden." },
    { nombre: "Usuario urgente/prioridad", arrayInicial: ["Lucia", "Marcos"], operación: "cola.unshift(\"PRIORIDAD: Ana\")", código: "const cola = [\"Lucia\", \"Marcos\"];\ncola.unshift(\"PRIORIDAD: Ana\");", resultadoFinal: ["PRIORIDAD: Ana", "Lucia", "Marcos"], explicacion: "El usuario prioritario pasa al primer lugar." }
  ]},
  { id: 4, método: "shift", categoria: "mutador", variantes: [
    { nombre: "Eliminar el primer elemento", arrayInicial: [10, 20, 30], operación: "números.shift()", código: "const números = [10, 20, 30];\nnúmeros.shift();", resultadoFinal: [20, 30], explicacion: "shift remueve el primer elemento del array." },
    { nombre: "Guardar el eliminado", arrayInicial: ["primero", "segundo"], operación: "const eliminado = cola.shift()", código: "const cola = [\"primero\", \"segundo\"];\nconst eliminado = cola.shift();", resultadoFinal: { eliminado: "primero", array: ["segundo"] }, explicacion: "El valor removido se puede usar luego." },
    { nombre: "Simular cola de atencion", arrayInicial: ["Cliente A", "Cliente B", "Cliente C"], operación: "atender con shift en orden FIFO", código: "const clientes = [\"Cliente A\", \"Cliente B\", \"Cliente C\"];\nconst atendidos = [];\nwhile (clientes.length) atendidos.push(clientes.shift());", resultadoFinal: ["Cliente A", "Cliente B", "Cliente C"], explicacion: "FIFO: primero en entrar, primero en salir." }
  ]},
  { id: 5, método: "splice", categoria: "mutador", variantes: [
    { nombre: "Eliminar elementos", arrayInicial: ["a", "b", "c", "d"], operación: "letras.splice(1, 2)", código: "const letras = [\"a\", \"b\", \"c\", \"d\"];\nconst eliminados = letras.splice(1, 2);", resultadoFinal: { eliminados: ["b", "c"], array: ["a", "d"] }, explicacion: "Elimina desde un indice y devuelve lo quitado." },
    { nombre: "Insertar sin eliminar", arrayInicial: ["Ana", "Luis"], operación: "nombres.splice(1, 0, \"Carlos\")", código: "const nombres = [\"Ana\", \"Luis\"];\nnombres.splice(1, 0, \"Carlos\");", resultadoFinal: ["Ana", "Carlos", "Luis"], explicacion: "Con deleteCount=0 solo inserta." },
    { nombre: "Reemplazar elementos", arrayInicial: ["x", "y", "z", "w"], operación: "arr.splice(1, 2, \"m\", \"n\")", código: "const arr = [\"x\", \"y\", \"z\", \"w\"];\narr.splice(1, 2, \"m\", \"n\");", resultadoFinal: ["x", "m", "n", "w"], explicacion: "Quita y agrega en una sola operación." }
  ]},
  { id: 6, método: "slice", categoria: "no mutador", variantes: [
    { nombre: "Copiar una parte", arrayInicial: [1, 2, 3, 4, 5], operación: "nums.slice(0, 2)", código: "const nums = [1, 2, 3, 4, 5];\nconst copia = nums.slice(0, 2);", resultadoFinal: [1, 2], explicacion: "Devuelve copia parcial sin modificar original." },
    { nombre: "Desde indice inicial hasta final", arrayInicial: ["A", "B", "C", "D", "E"], operación: "letras.slice(1, 4)", código: "const letras = [\"A\", \"B\", \"C\", \"D\", \"E\"];\nconst tramo = letras.slice(1, 4);", resultadoFinal: ["B", "C", "D"], explicacion: "El indice final no se incluye." },
    { nombre: "Ultimos elementos sin modificar", arrayInicial: [10, 20, 30, 40], operación: "nums.slice(-2)", código: "const nums = [10, 20, 30, 40];\nconst ultimos = nums.slice(-2);", resultadoFinal: [30, 40], explicacion: "Indices negativos cuentan desde el final." }
  ]},
  { id: 7, método: "indexOf", categoria: "busqueda", variantes: [
    { nombre: "Buscar existente", arrayInicial: ["gato", "perro", "pez"], operación: "animales.indexOf(\"perro\")", código: "const animales = [\"gato\", \"perro\", \"pez\"];\nconst pos = animales.indexOf(\"perro\");", resultadoFinal: 1, explicacion: "Devuelve el primer indice encontrado." },
    { nombre: "Buscar inexistente", arrayInicial: [10, 20, 30], operación: "números.indexOf(50)", código: "const números = [10, 20, 30];\nconst pos = números.indexOf(50);", resultadoFinal: -1, explicacion: "Si no existe, indexOf retorna -1." },
    { nombre: "Usar resultado para mensaje", arrayInicial: ["Lima", "Bogota", "Quito"], operación: "mensaje segun indice", código: "const ciudades = [\"Lima\", \"Bogota\", \"Quito\"];\nconst indice = ciudades.indexOf(\"Madrid\");\nconst mensaje = indice === -1 ? \"Madrid no esta\" : `Madrid en ${indice}`;", resultadoFinal: "Madrid no esta", explicacion: "El -1 permite decidir mensajes claros al usuario." }
  ]},
  { id: 8, método: "includes", categoria: "busqueda", variantes: [
    { nombre: "Verificar existencia", arrayInicial: ["user", "admin", "guest"], operación: "roles.includes(\"admin\")", código: "const roles = [\"user\", \"admin\", \"guest\"];\nconst esAdmin = roles.includes(\"admin\");", resultadoFinal: true, explicacion: "Retorna booleano segun exista o no el valor." },
    { nombre: "Evitar duplicados antes de agregar", arrayInicial: ["ana", "luis"], operación: "si no existe, push", código: "const usuarios = [\"ana\", \"luis\"];\nconst nuevo = \"ana\";\nif (!usuarios.includes(nuevo)) usuarios.push(nuevo);", resultadoFinal: ["ana", "luis"], explicacion: "Se valida antes de insertar para no duplicar." },
    { nombre: "Validar permiso/rol", arrayInicial: ["lector", "editor"], operación: "permisos.includes(\"admin\")", código: "const permisos = [\"lector\", \"editor\"];\nconst puedeBorrar = permisos.includes(\"admin\");", resultadoFinal: false, explicacion: "Sirve para habilitar o bloquear acciones por rol." }
  ]},
  { id: 9, método: "forEach", categoria: "iteracion", variantes: [
    { nombre: "Recorrer nombres", arrayInicial: ["Ana", "Luis"], operación: "forEach para armar saludos", código: "const nombres = [\"Ana\", \"Luis\"];\nconst saludos = [];\nnombres.forEach((n) => saludos.push(`Hola ${n}`));", resultadoFinal: ["Hola Ana", "Hola Luis"], explicacion: "forEach recorre y suele usarse con efectos secundarios." },
    { nombre: "Recorrer números y mostrar doble", arrayInicial: [2, 4, 6], operación: "forEach con acumulador externo", código: "const nums = [2, 4, 6];\nconst dobles = [];\nnums.forEach((n) => dobles.push(n * 2));", resultadoFinal: [4, 8, 12], explicacion: "No crea nuevo array automaticamente como map." },
    { nombre: "Recorrer objetos", arrayInicial: [{ nombre: "Ana", edad: 20 }, { nombre: "Leo", edad: 25 }], operación: "forEach para formatear texto", código: "const personas = [{ nombre: \"Ana\", edad: 20 }, { nombre: \"Leo\", edad: 25 }];\nconst mensajes = [];\npersonas.forEach((p) => mensajes.push(`${p.nombre} tiene ${p.edad}`));", resultadoFinal: ["Ana tiene 20", "Leo tiene 25"], explicacion: "Ideal para imprimir, loggear o preparar vistas." }
  ]},
  { id: 10, método: "map", categoria: "transformacion", variantes: [
    { nombre: "Transformar números", arrayInicial: [1, 2, 3], operación: "números.map(n => n * 3)", código: "const números = [1, 2, 3];\nconst triples = números.map((n) => n * 3);", resultadoFinal: [3, 6, 9], explicacion: "map retorna un array nuevo transformado." },
    { nombre: "Transformar strings", arrayInicial: ["ana", "leo"], operación: "nombres.map(n => n.toUpperCase())", código: "const nombres = [\"ana\", \"leo\"];\nconst mayus = nombres.map((n) => n.toUpperCase());", resultadoFinal: ["ANA", "LEO"], explicacion: "Cada elemento se transforma y se conserva el largo." },
    { nombre: "Precios con IVA", arrayInicial: [100, 200], operación: "precios.map(p => +(p * 1.21).toFixed(2))", código: "const precios = [100, 200];\nconst conIva = precios.map((p) => +(p * 1.21).toFixed(2));", resultadoFinal: [121, 242], explicacion: "Se aplica la formula a cada precio sin mutar original." }
  ]},
  { id: 11, método: "filter", categoria: "transformacion", variantes: [
    { nombre: "Filtrar números", arrayInicial: [4, 11, 20, 8], operación: "números.filter(n => n > 10)", código: "const números = [4, 11, 20, 8];\nconst mayores = números.filter((n) => n > 10);", resultadoFinal: [11, 20], explicacion: "Conserva solo los que cumplen la condicion." },
    { nombre: "Filtrar palabras", arrayInicial: ["sol", "montana", "casa", "escuela"], operación: "palabras.filter(p => p.length > 5)", código: "const palabras = [\"sol\", \"montana\", \"casa\", \"escuela\"];\nconst largas = palabras.filter((p) => p.length > 5);", resultadoFinal: ["montana", "escuela"], explicacion: "La condicion se evalua por cada item." },
    { nombre: "Filtrar objetos activos", arrayInicial: [{ nombre: "Ana", activo: true }, { nombre: "Luis", activo: false }], operación: "usuarios.filter(u => u.activo)", código: "const usuarios = [{ nombre: \"Ana\", activo: true }, { nombre: \"Luis\", activo: false }];\nconst activos = usuarios.filter((u) => u.activo);", resultadoFinal: [{ nombre: "Ana", activo: true }], explicacion: "Funciona muy bien con propiedades booleanas." }
  ]},
  { id: 12, método: "reduce", categoria: "transformacion", variantes: [
    { nombre: "Sumar", arrayInicial: [1, 2, 3, 4], operación: "nums.reduce((acc, n) => acc + n, 0)", código: "const nums = [1, 2, 3, 4];\nconst total = nums.reduce((acc, n) => acc + n, 0);", resultadoFinal: 10, explicacion: "reduce acumula todo en un unico valor final." },
    { nombre: "Multiplicar", arrayInicial: [2, 3, 4], operación: "nums.reduce((acc, n) => acc * n, 1)", código: "const nums = [2, 3, 4];\nconst producto = nums.reduce((acc, n) => acc * n, 1);", resultadoFinal: 24, explicacion: "Para producto el acumulador inicia en 1." },
    { nombre: "Acumular precios de objetos", arrayInicial: [{ precio: 10 }, { precio: 25.5 }, { precio: 4.5 }], operación: "items.reduce((acc, i) => acc + i.precio, 0)", código: "const items = [{ precio: 10 }, { precio: 25.5 }, { precio: 4.5 }];\nconst total = items.reduce((acc, i) => acc + i.precio, 0);", resultadoFinal: 40, explicacion: "Suma una propiedad puntual de cada objeto." }
  ]},
  { id: 13, método: "sort", categoria: "transformacion", variantes: [
    { nombre: "Ordenar números", arrayInicial: [40, 5, 100, 2], operación: "nums.sort((a, b) => a - b)", código: "const nums = [40, 5, 100, 2];\nnums.sort((a, b) => a - b);", resultadoFinal: [2, 5, 40, 100], explicacion: "Comparador numerico evita orden alfabetico." },
    { nombre: "Ordenar palabras", arrayInicial: ["pera", "banana", "manzana"], operación: "palabras.sort()", código: "const palabras = [\"pera\", \"banana\", \"manzana\"];\npalabras.sort();", resultadoFinal: ["banana", "manzana", "pera"], explicacion: "Sin comparador, ordena texto lexicograficamente." },
    { nombre: "Ordenar objetos por edad", arrayInicial: [{ nombre: "Ana", edad: 30 }, { nombre: "Luis", edad: 22 }], operación: "personas.sort((a, b) => a.edad - b.edad)", código: "const personas = [{ nombre: \"Ana\", edad: 30 }, { nombre: \"Luis\", edad: 22 }];\npersonas.sort((a, b) => a.edad - b.edad);", resultadoFinal: [{ nombre: "Luis", edad: 22 }, { nombre: "Ana", edad: 30 }], explicacion: "Se define el criterio con una propiedad numerica." }
  ]},
  { id: 14, método: "reverse", categoria: "mutador", variantes: [
    { nombre: "Invertir array", arrayInicial: ["a", "b", "c"], operación: "letras.reverse()", código: "const letras = [\"a\", \"b\", \"c\"];\nletras.reverse();", resultadoFinal: ["c", "b", "a"], explicacion: "reverse invierte el array en el mismo lugar." },
    { nombre: "Invertir números", arrayInicial: [1, 2, 3, 4], operación: "números.reverse()", código: "const números = [1, 2, 3, 4];\nnúmeros.reverse();", resultadoFinal: [4, 3, 2, 1], explicacion: "El ultimo valor pasa al inicio." },
    { nombre: "Invertir string con split + reverse + join", arrayInicial: "Hola mundo", operación: "texto.split('').reverse().join('')", código: "const texto = \"Hola mundo\";\nconst invertido = texto.split(\"\").reverse().join(\"\");", resultadoFinal: "odnum aloH", explicacion: "Se convierte el string a array temporal para invertir." }
  ]},
  { id: 15, método: "secreto", categoria: "especial", variantes: [
    { nombre: "Decodificar mensaje fijo", arrayInicial: ["Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo."], operación: "decodificarSecreto(mensajeFijo)", código: "const mensaje = \"Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.\";\nconst salida = decodificarSecreto(mensaje);", resultadoFinal: "Hoy a las 22 hs. nos reunimos en casa de Marcelo.", explicacion: "Cada bloque entre parentesis se invierte en forma independiente." },
    { nombre: "Ingresar mensaje propio", arrayInicial: ["Nos vemos (anecham)"], operación: "decodificarSecreto(mensajeIngresado)", código: "const mensajeIngresado = \"Nos vemos (anecham)\";\nconst salida = decodificarSecreto(mensajeIngresado);", resultadoFinal: "Nos vemos mechana", explicacion: "La misma funcion sirve para cualquier string con bloques." },
    { nombre: "Mostrar paso a paso", arrayInicial: ["Clave (oterc es) y punto (lanif)"], operación: "extraer bloques y mostrar su inversion", código: "const texto = \"Clave (oterc es) y punto (lanif)\";\nconst pasos = pasosDecodificación(texto);\nconst final = decodificarSecreto(texto);", resultadoFinal: { pasos: [{ fragmentoOriginal: "oterc es", fragmentoInvertido: "se creto" }, { fragmentoOriginal: "lanif", fragmentoInvertido: "final" }], salida: "Clave se creto y punto final" }, explicacion: "Se visualiza cada fragmento original y su version invertida." }
  ]}
];

export function getExerciseByMethod(método) {
  const found = ejercicios.find((ej) => ej.método === método);
  if (!found) throw new Error(`Método no encontrado: ${método}`);
  return structuredClone(found);
}

export function getAllExercises() {
  return structuredClone(ejercicios);
}

export function getSecretoApi() {
  const fijo = ejercicios.find((ej) => ej.método === "secreto")?.variantes?.[0]?.arrayInicial?.[0] || "";
  return { entrada: fijo, salida: decodificarSecreto(fijo), pasos: pasosDecodificación(fijo) };
}
