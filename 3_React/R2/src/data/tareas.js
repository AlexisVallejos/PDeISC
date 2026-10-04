// tareas de ejemplo para que la app no arranque vacia
// esto simula lo que despues va a vivir en el estado de React

const tareasIniciales = [
  {
    id: 1,
    titulo: "Terminar el trabajo practico de React",
    descripcion:
      "Repasar los componentes, revisar que las rutas funcionen bien y dejar todo prolijo antes de entregar. Falta probar el modo oscuro en el celular.",
    completada: false,
    fechaCreacion: "18/08/26",
  },
  {
    id: 2,
    titulo: "Estudiar para la mesa de examen",
    descripcion:
      "Leer de nuevo el capitulo de estructuras de control y hacer los ejercicios que quedaron pendientes de la guia 3.",
    completada: false,
    fechaCreacion: "19/08/26",
  },
  {
    id: 3,
    titulo: "Comprar utiles para el proyecto grupal",
    descripcion:
      "Hoja afiche, marcadores y la carpeta para entregar la maqueta el viernes que viene.",
    completada: true,
    fechaCreacion: "15/08/26",
  },
  {
    id: 4,
    titulo: "Subir el video de la exposicion",
    descripcion:
      "Editar el video que grabamos en el laboratorio y subirlo al classroom antes de la clase del jueves.",
    completada: false,
    fechaCreacion: "20/08/26",
  },
];

export default tareasIniciales;
