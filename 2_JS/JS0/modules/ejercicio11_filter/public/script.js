/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio11_filter/public/script.js
 * Rol: inicializa la app interactiva del ejercicio en el navegador.
 * Idea clave: la logica de render, fetch, tema y validacion visual fue atomizada en /shared/exerciseApp.js.
 * Como defenderlo: este archivo queda como punto de entrada pequeno y el comportamiento real vive en un modulo compartido.
 * Validacion: el modulo compartido valida visualmente y el backend vuelve a validar antes de ejecutar.
 */
import { initExerciseApp } from "/shared/exerciseApp.js";

initExerciseApp();