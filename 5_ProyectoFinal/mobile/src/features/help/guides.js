/**
 * Guías de "cómo usar" cada pantalla: una captura real de la pantalla y los pasos con íconos.
 * La clave es la ruta (usePathname); el inicio cambia según el rol.
 */
const img = {
  'home-athlete': require('../../../assets/help/home-athlete.jpg'),
  'home-coach': require('../../../assets/help/home-coach.jpg'),
  'home-admin': require('../../../assets/help/home-admin.jpg'),
  diary: require('../../../assets/help/diary.jpg'),
  'diary-entry': require('../../../assets/help/diary-entry.jpg'),
  workouts: require('../../../assets/help/workouts.jpg'),
  'workout-form': require('../../../assets/help/workout-form.jpg'),
  progress: require('../../../assets/help/progress.jpg'),
  profile: require('../../../assets/help/profile.jpg'),
  body: require('../../../assets/help/body.jpg'),
  assistant: require('../../../assets/help/assistant.jpg'),
  'nutrition-plans': require('../../../assets/help/nutrition-plans.jpg'),
  'weekly-reports': require('../../../assets/help/weekly-reports.jpg'),
  coach: require('../../../assets/help/coach.jpg'),
  catalog: require('../../../assets/help/catalog.jpg'),
  users: require('../../../assets/help/users.jpg'),
  'coach-reports': require('../../../assets/help/coach-reports.jpg'),
};

const guide = (key, title, intro, steps) => ({ key, title, intro, image: img[key], steps });
const step = (icon, title, text) => ({ icon, title, text });

export const GUIDES = {
  'home-athlete': guide('home-athlete', 'Tu inicio', 'Lo más importante de tu día de un vistazo.', [
    step('add-circle-outline', 'Registrá rápido', '"Registrar comida" y "Nueva sesión" abren los formularios con la fecha de hoy.'),
    step('body-outline', 'Calculá tus metas', 'Cargá peso, altura y objetivo y la app calcula tus calorías y macros.'),
    step('pie-chart-outline', 'Anillos del día', 'El anillo grande son las calorías; los chicos, proteínas, carbohidratos y grasas.'),
    step('stats-chart-outline', 'Últimos 7 días', 'Barras verdes: días dentro de la meta. Naranjas: te pasaste.'),
  ]),
  'home-coach': guide('home-coach', 'Tus atletas', 'El seguimiento diario y semanal de cada cliente.', [
    step('calendar-outline', 'Elegí el día', 'Con ‹ y › cambiás de día; las tarjetas muestran qué comió y entrenó cada atleta.'),
    step('search-outline', 'Buscá un cliente', 'Filtrá por nombre o email.'),
    step('stats-chart-outline', 'Ver seguimiento', 'Abre la ficha: semana, diario, rutinas, progreso y objetivos del atleta.'),
    step('barbell-outline', 'Asigná rutinas y planes', 'Desde la ficha cargás rutinas y planes de alimentación.'),
  ]),
  'home-admin': guide('home-admin', 'Panel del administrador', 'Los números del sistema y la gestión de entrenadores.', [
    step('person-add-outline', 'Creá entrenadores', '"Crear entrenador" abre el alta con el rol ya elegido.'),
    step('people-outline', 'Asigná atletas', 'En Usuarios elegís el entrenador de cada atleta.'),
    step('document-text-outline', 'Reportes mensuales', 'Actividad de cada entrenador, con descarga en PDF.'),
  ]),
  diary: guide('diary', 'Diario de comidas', 'Todo lo que comés en el día, separado por comida.', [
    step('calendar-outline', 'Cambiá de día', 'Las flechas van al día anterior o siguiente; tocando la fecha volvés a hoy.'),
    step('add-circle-outline', 'Agregá', 'El + verde de cada comida abre el registro para desayuno, almuerzo, etc.'),
    step('create-outline', 'Editá o borrá', 'Tocá un alimento para cambiarlo; el tacho lo elimina.'),
    step('leaf-outline', 'Micronutrientes', 'Fibra, sodio, vitaminas y minerales contra el valor diario recomendado.'),
  ]),
  'diary-entry': guide('diary-entry', 'Registrar una comida', 'Hay varias formas de cargar lo que comiste.', [
    step('search-outline', 'Buscá en el catálogo', 'Escribí (ej. "milanesa"), tocá el alimento y poné los gramos: los macros se calculan solos.'),
    step('sparkles-outline', 'Contale al asistente', 'Escribí "comí 2 empanadas de carne" y la IA lo registra por vos.'),
    step('camera-outline', 'Foto con IA', 'Sacale una foto al plato: estima gramos y macros, y vos los ajustás.'),
    step('create-outline', 'Carga manual', 'Si no aparece, cargá nombre, gramos y macros de la etiqueta.'),
  ]),
  workouts: guide('workouts', 'Entrenamientos', 'Tus sesiones de la semana y las rutinas de tu entrenador.', [
    step('calendar-outline', 'Semana', 'Con ‹ y › cambiás de semana.'),
    step('add-outline', 'Nueva sesión', 'Cargá ejercicios, series, repeticiones y kilos.'),
    step('scan-outline', 'Entrenar con cámara', 'En la compu, la cámara cuenta tus repeticiones y te corrige la técnica.'),
    step('checkmark-circle-outline', 'Rutinas asignadas', 'Las del entrenador quedan pendientes hasta que las marcás como realizadas.'),
  ]),
  'workout-form': guide('workout-form', 'Cargar una sesión', 'Armá la sesión ejercicio por ejercicio.', [
    step('barbell-outline', 'Agregá ejercicios', 'Elegí del catálogo o escribí uno nuevo.'),
    step('list-outline', 'Series', 'Por serie: repeticiones, kilos (acepta 1,25) y RPE del 1 al 10 (esfuerzo).'),
    step('checkmark-done-outline', 'Estado', 'Pendiente o Realizada. Una fecha futura queda pendiente.'),
  ]),
  progress: guide('progress', 'Tu progreso', 'Cómo venís con la alimentación y la fuerza.', [
    step('calendar-outline', 'Semana', 'Resumen de la semana y comparación con la anterior.'),
    step('options-outline', 'Rango', 'Elegí 7, 14 o 30 días para los promedios y el gráfico.'),
    step('trending-up-outline', 'Fuerza', 'Mejor peso de cada ejercicio y cuánto cambió el volumen.'),
  ]),
  profile: guide('profile', 'Tu perfil', 'Tus datos, metas y opciones.', [
    step('contrast-outline', 'Apariencia', 'Modo claro, oscuro o el del teléfono.'),
    step('flag-outline', 'Metas diarias', 'Calculalas con tus datos o escribilas a mano.'),
    step('key-outline', 'Contraseña', 'Cambiala o creá una si entraste con Google o Facebook.'),
  ]),
  body: guide('body', 'Datos y objetivo', 'La app calcula tus calorías y macros como un nutricionista.', [
    step('body-outline', 'Tus datos', 'Sexo, fecha de nacimiento, altura y peso. El % de grasa es opcional.'),
    step('walk-outline', 'Actividad', 'Cuánto te movés en la semana.'),
    step('flag-outline', 'Objetivo', 'Déficit, recomposición, mantenimiento o volumen, y a qué ritmo.'),
    step('checkmark-outline', 'Guardar', 'Las calorías y macros calculados pasan a ser tus metas del diario.'),
  ]),
  assistant: guide('assistant', 'Asistente con IA', 'Un entrenador al que le hablás o escribís.', [
    step('chatbubble-outline', 'Escribí', 'Pedile que anote comidas, arme rutinas o te diga cuánto te falta. Enter envía.'),
    step('mic-outline', 'Hablale', 'Tocá el micrófono, hablá y volvé a tocar para enviar.'),
    step('camera-outline', 'Fotos', 'Mandá la foto de tu plato y estima los macros.'),
    step('shield-checkmark-outline', 'Solo salud y entrenamiento', 'No responde temas ajenos a la alimentación y el entrenamiento.'),
  ]),
  'nutrition-plans': guide('nutrition-plans', 'Plan de alimentación', 'El menú que arma tu entrenador.', [
    step('calendar-outline', 'Elegí el día', 'Ves las comidas que corresponden a ese día.'),
    step('restaurant-outline', 'Pasalo al diario', 'Confirmá que lo comiste y se copia a tu diario.'),
    step('download-outline', 'PDF', 'Descargá el plan completo.'),
  ]),
  'weekly-reports': guide('weekly-reports', 'Informes semanales', 'Cada lunes se publica el informe de la semana anterior.', [
    step('chevron-down-outline', 'Desplegá', 'Tocá una semana para ver el resumen.'),
    step('download-outline', 'Descargá', 'Bajá el PDF para compartirlo.'),
  ]),
  coach: guide('coach', 'Entrenar con cámara', 'La cámara cuenta repeticiones y corrige la postura.', [
    step('body-outline', 'Elegí el ejercicio', 'Sentadilla, flexiones, plancha y más.'),
    step('videocam-outline', 'Ubicate', 'De costado y entero en la imagen, a 2 o 3 metros.'),
    step('volume-high-outline', 'Escuchá', 'Te avisa con voz cada repetición y qué corregir.'),
  ]),
  catalog: guide('catalog', 'Catálogo', 'Los alimentos y ejercicios que usan todos.', [
    step('nutrition-outline', 'Alimentos', 'Creá y editá alimentos del catálogo global.'),
    step('barbell-outline', 'Ejercicios', 'Agregá ejercicios con su grupo muscular.'),
  ]),
  users: guide('users', 'Usuarios', 'Altas, roles y asignación de entrenadores.', [
    step('person-add-outline', 'Nuevo usuario', 'Creá atletas, entrenadores o admins.'),
    step('funnel-outline', 'Filtrá', 'Por rol o buscando nombre o email.'),
    step('people-outline', 'Asigná', 'Abrí un atleta y elegí su entrenador.'),
  ]),
  'coach-reports': guide('coach-reports', 'Reportes de entrenadores', 'La actividad de cada entrenador por mes.', [
    step('calendar-outline', 'Mes', 'Cambiá de mes con Anterior y Siguiente.'),
    step('download-outline', 'PDF', 'Uno general o uno por entrenador.'),
  ]),
};

/** La guía de la pantalla actual, o null si no tiene. */
export function guideFor(pathname, role) {
  if (pathname === '/' || pathname === '') return GUIDES[`home-${role}`] ?? null;
  const first = pathname.split('/')[1];
  return GUIDES[first] ?? null;
}
