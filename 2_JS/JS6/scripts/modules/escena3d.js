// ARCHIVO: scripts/modules/escena3d.js
// QUÉ HACE: dibuja y anima la escena 3D con Three.js (horca, taburete, muñeco, luces, confeti).
// CONCEPTOS CLAVE PARA LA DEFENSA:
//  - Three.js dibuja con WebGL dentro de un <canvas>. Necesita siempre: escena (el mundo), cámara (el punto de vista)
//    y renderer (el que pinta la escena vista desde la cámara).
//  - Un objeto 3D visible se llama Mesh = geometría (la forma) + material (el aspecto: color, brillo).
//  - Un Group agrupa objetos: moverlo o girarlo mueve todos sus hijos juntos (así articulo el muñeco).
//  - Las animaciones no usan CSS: se calculan en cada cuadro (~60 veces por segundo) en la función "cuadro".
// main.js solo usa el objeto que devuelve crearEscena(): preparar, esperar, mostrarErrores, reaccionar, perder, ganar.

import * as THREE from "three"; // Librería 3D completa; el nombre "three" lo resuelve el import map del HTML (apunta al CDN).
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // Permite girar la cámara arrastrando con el mouse o el dedo.

// Orden en que aparecen las partes del muñeco con cada error.
const PARTES = ["cabeza", "torso", "brazoIzq", "brazoDer", "piernaIzq", "piernaDer"]; // El error 1 muestra la cabeza, el 2 el torso, etc.
const ALTURA_VIGA = 4.25; // Altura (eje Y) de la viga horizontal de la que cuelga la cuerda.
const ALTURA_TABURETE = 0.85; // Altura del asiento del taburete sobre el piso: ahí se paran los pies.
const CUELLO = 1.83; // Distancia de los pies al cuello del muñeco (dónde se ata el lazo).
const OPACIDAD_FANTASMA = 0.16; // Transparencia de las partes que todavía no "aparecieron" (silueta).

const TEMAS = { // Colores y luces de la escena para cada tema; son números hexadecimales de color (0xRRGGBB) e intensidades.
  oscuro: { suelo: 0x141c2e, plataforma: 0x3a2a22, cielo: 0x8fa8ff, tierra: 0x1a1020, hemisferio: 1.1, sol: 1.6 },
  claro: { suelo: 0xdfe6ef, plataforma: 0x8a6248, cielo: 0xffffff, tierra: 0xb9a48f, hemisferio: 1.5, sol: 2.2 }
};

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)"); // Si el usuario pidió menos movimiento, se omiten las animaciones.

// Curvas de animación: reciben el progreso p (de 0 a 1) y devuelven un valor "suavizado".
const suave = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2); // Empieza lento, acelera y frena al final (ease in-out cúbico).
const salida = (p) => 1 - (1 - p) ** 3; // Arranca rápido y frena al final (ease out).
const rebote = (p) => 1 + 2.7 * (p - 1) ** 3 + 1.7 * (p - 1) ** 2; // Se pasa un poco del destino y vuelve (efecto "rebote" o back).
const mezclar = (a, b, p) => a + (b - a) * p; // Interpolación lineal: con p=0 da a, con p=1 da b, en medio un punto intermedio.

function material(color, extra = {}) { // Crea un material estándar (reacciona a la luz).
  return new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.05, flatShading: true, ...extra }); // flatShading da el look "facetado" low-poly; "extra" permite sobreescribir opciones.
}

function malla(geometria, mat, x = 0, y = 0, z = 0) { // Crea un Mesh ya posicionado.
  const objeto = new THREE.Mesh(geometria, mat); // Forma + aspecto.
  objeto.position.set(x, y, z); // Posición relativa a su padre.
  objeto.castShadow = true; // Proyecta sombra.
  objeto.receiveShadow = true; // Recibe sombras de otros.
  return objeto;
}

// Armo la horca de madera, la plataforma y el taburete donde se para el muñeco.
function crearHorca(materiales) {
  const horca = new THREE.Group(); // Contenedor de todas las piezas de la horca.
  const { madera, maderaOscura, plataforma } = materiales; // Desestructuro los materiales que necesito.
  horca.add(malla(new THREE.BoxGeometry(3.8, 0.3, 2.4), plataforma, -0.2, 0.15, 0)); // Plataforma: caja ancha y baja (ancho, alto, profundidad).
  horca.add(malla(new THREE.BoxGeometry(0.26, 4.3, 0.26), madera, -1.5, 2.45, -0.3)); // Poste vertical.
  horca.add(malla(new THREE.BoxGeometry(2.25, 0.24, 0.26), madera, -0.5, ALTURA_VIGA + 0.12, -0.3)); // Viga horizontal superior.
  const riostra = malla(new THREE.BoxGeometry(0.14, 1.2, 0.14), maderaOscura, -1.12, 3.85, -0.3); // Refuerzo diagonal entre poste y viga.
  riostra.rotation.z = -Math.PI / 4; // Lo inclino 45° (Three.js usa radianes: π/4 = 45°).
  horca.add(riostra);
  horca.add(malla(new THREE.BoxGeometry(0.6, 0.12, 0.6), maderaOscura, -1.5, 0.36, -0.3)); // Base del poste.
  // La viga llega hasta un soporte corto del que cuelga la cuerda, encima del muñeco.
  horca.add(malla(new THREE.BoxGeometry(0.3, 0.12, 0.6), maderaOscura, 0.45, ALTURA_VIGA, -0.15)); // Soporte donde se ata la cuerda.
  return horca;
}

function crearTaburete(madera) {
  const pivote = new THREE.Group(); // El grupo está ubicado en la pata derecha para que, al caerse, gire como si lo patearan.
  pivote.position.set(0.75, 0.3, 0); // Sobre la plataforma, debajo del muñeco.
  const asiento = malla(new THREE.BoxGeometry(0.7, 0.09, 0.62), madera, -0.35, 0.5, 0); // Tabla del asiento.
  pivote.add(asiento);
  [[-0.62, -0.24], [-0.08, -0.24], [-0.62, 0.24], [-0.08, 0.24]].forEach(([x, z]) => { // Cuatro patas en las esquinas (pares x, z).
    pivote.add(malla(new THREE.BoxGeometry(0.07, 0.5, 0.07), madera, x, 0.23, z));
  });
  return pivote;
}

// Construyo el muñeco con geometrías simples. Cada parte tiene sus materiales para poder volverla fantasma.
function crearMuneco() {
  const muneco = new THREE.Group(); // Grupo raíz del muñeco.
  const partes = {}; // Diccionario nombre → grupo, para animar cada parte por separado.
  const colores = { piel: 0xffc9a3, ropa: 0x2563eb, pantalon: 0x334155, zapato: 0x111827, pelo: 0x3b2417 }; // Paleta del personaje.

  const nuevaParte = (nombre, padre, x, y, z) => { // Crea un grupo articulable en la posición de su "articulación".
    const grupo = new THREE.Group();
    grupo.position.set(x, y, z); // Este punto es el pivote: al rotar el grupo, gira desde acá (hombro, cadera...).
    padre.add(grupo); // Lo cuelgo del padre.
    partes[nombre] = grupo; // Lo registro por nombre.
    return grupo;
  };

  // Piernas: el pivote está en la cadera para poder moverlas.
  [["piernaIzq", -0.15], ["piernaDer", 0.15]].forEach(([nombre, x]) => { // Una pierna a cada lado (x negativo = izquierda).
    const pierna = nuevaParte(nombre, muneco, x, 0.86, 0); // Pivote a la altura de la cadera.
    pierna.add(malla(new THREE.CapsuleGeometry(0.1, 0.52, 4, 10), material(colores.pantalon), 0, -0.38, 0)); // Cápsula = cilindro con extremos redondeados.
    pierna.add(malla(new THREE.BoxGeometry(0.2, 0.12, 0.3), material(colores.zapato), 0, -0.8, 0.05)); // Zapato.
  });

  const torso = nuevaParte("torso", muneco, 0, 0, 0); // El torso se ubica en el origen; sus hijos tienen alturas absolutas.
  torso.add(malla(new THREE.CapsuleGeometry(0.28, 0.42, 4, 14), material(colores.ropa), 0, 1.26, 0)); // Remera azul.
  torso.add(malla(new THREE.CylinderGeometry(0.29, 0.29, 0.08, 14), material(colores.zapato), 0, 0.96, 0)); // Cinturón.

  // Brazos en dos tramos: hombro → codo → mano, para que el saludo y el festejo se doblen como un brazo real.
  const codos = {}; // Diccionario de los codos (se animan aparte del hombro).
  [["brazoIzq", -0.36], ["brazoDer", 0.36]].forEach(([nombre, x]) => {
    const brazo = nuevaParte(nombre, muneco, x, 1.6, 0); // Pivote en el hombro.
    brazo.add(malla(new THREE.CapsuleGeometry(0.085, 0.16, 4, 10), material(colores.ropa), 0, -0.14, 0)); // Parte alta del brazo.
    const codo = new THREE.Group(); // Segundo pivote: el codo, hijo del hombro.
    codo.position.y = -0.3; // Está 0,3 unidades más abajo que el hombro.
    brazo.add(codo);
    codo.add(malla(new THREE.SphereGeometry(0.085, 10, 8), material(colores.ropa))); // Esfera que tapa la unión del codo.
    codo.add(malla(new THREE.CapsuleGeometry(0.075, 0.14, 4, 10), material(colores.ropa), 0, -0.13, 0)); // Antebrazo.
    codo.add(malla(new THREE.SphereGeometry(0.1, 10, 8), material(colores.piel), 0, -0.3, 0)); // Mano.
    codos[nombre] = codo;
  });

  const cabeza = nuevaParte("cabeza", muneco, 0, 1.76, 0); // Pivote en la base del cuello.
  const piel = material(colores.piel);
  cabeza.add(malla(new THREE.CylinderGeometry(0.09, 0.1, 0.16, 10), piel, 0, 0.06, 0)); // Cuello.
  cabeza.add(malla(new THREE.IcosahedronGeometry(0.37, 2), piel, 0, 0.45, 0)); // Cabeza: icosaedro subdividido (esfera facetada).
  const pelo = malla(new THREE.SphereGeometry(0.38, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), material(colores.pelo), 0, 0.5, -0.02); // Casquete de esfera que cubre la parte de arriba.
  pelo.rotation.x = -0.25; // Lo inclino hacia atrás para dejar ver la frente.
  cabeza.add(pelo);

  const negro = material(0x0b0f19, { flatShading: false, roughness: 0.3 }); // Negro liso y levemente brillante para ojos y boca.
  const ojos = new THREE.Group(); // Grupo de ojos abiertos (para poder escalarlos al parpadear).
  [-0.13, 0.13].forEach((x) => ojos.add(malla(new THREE.SphereGeometry(0.055, 10, 8), negro, x, 0.5, 0.33))); // Dos esferas pequeñas.
  cabeza.add(ojos);

  const ojosX = new THREE.Group(); // Ojos en forma de X para cuando pierde.
  [-0.13, 0.13].forEach((x) => {
    [0.7, -0.7].forEach((giro) => { // Dos rayitas cruzadas por ojo.
      const linea = malla(new THREE.BoxGeometry(0.15, 0.035, 0.03), negro, x, 0.5, 0.34);
      linea.rotation.z = giro; // Una inclinada a cada lado forma la X.
      ojosX.add(linea);
    });
  });
  ojosX.visible = false; // Ocultos hasta la derrota.
  cabeza.add(ojosX);

  const cejas = [-0.13, 0.13].map((x) => { // Dos cejas; map devuelve el array de cejas creado.
    const ceja = malla(new THREE.BoxGeometry(0.13, 0.03, 0.03), material(colores.pelo), x, 0.62, 0.33);
    cabeza.add(ceja);
    return ceja;
  });

  const boca = malla(new THREE.TorusGeometry(0.09, 0.022, 6, 14, Math.PI), negro); // Medio anillo (arco = π) que hace de boca.
  cabeza.add(boca);
  const rubor = material(0xff8a8a, { transparent: true, opacity: 0.55 }); // Rosado semitransparente para las mejillas.
  [-0.23, 0.23].forEach((x) => cabeza.add(malla(new THREE.SphereGeometry(0.06, 8, 6), rubor, x, 0.4, 0.27)));

  // Guardo los materiales de cada parte para alternar entre fantasma y sólido.
  const materiales = {};
  PARTES.forEach((nombre) => {
    materiales[nombre] = []; // Lista de materiales de esa parte.
    partes[nombre].traverse((hijo) => { // traverse recorre el grupo y todos sus descendientes.
      if (!hijo.isMesh) return; // Solo me interesan los objetos con forma.
      hijo.material = hijo.material.clone(); // Clono el material: así hacer transparente una parte no afecta a las demás que lo compartían.
      materiales[nombre].push({ mat: hijo.material, opacidad: hijo.material.opacity, transparente: hijo.material.transparent }); // Recuerdo su aspecto original.
    });
  });

  return { muneco, partes, materiales, codos, ojos, ojosX, boca, cejas }; // Todo lo que la escena necesita para animar.
}

// La boca es medio anillo. Sonriendo va más arriba; triste se da vuelta y se adelanta,
// porque si no, la curva queda dentro de la esfera de la cabeza y la cara "desaparece".
function ponerBoca(boca, triste) {
  boca.rotation.z = triste ? 0 : Math.PI; // Un arco girado 180° (π) sonríe; sin girar, hace "mala cara".
  boca.position.set(0, triste ? 0.25 : 0.36, triste ? 0.35 : 0.32); // Cambio posición: triste más abajo y más adelante.
}

// Confeti con una sola malla instanciada para no crear cientos de objetos.
function crearConfeti(escena) {
  const cantidad = 180; // Cantidad de papelitos.
  const instancias = new THREE.InstancedMesh( // InstancedMesh dibuja muchas copias de una misma forma en una sola llamada a la GPU (muy eficiente).
    new THREE.PlaneGeometry(0.07, 0.12), // Cada papelito es un rectángulo diminuto.
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), // Material sin luces, visible de ambos lados.
    cantidad
  );
  instancias.visible = false; // Oculto hasta que se gane.
  instancias.frustumCulled = false; // Evita que Three.js lo descarte por error al calcular su caja envolvente.
  escena.add(instancias);
  const colores = [0xdc2626, 0x2563eb, 0x22c55e, 0xfacc15, 0xf472b6, 0xffffff].map((c) => new THREE.Color(c)); // Paleta de colores del confeti.
  const datos = Array.from({ length: cantidad }, () => ({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), rot: new THREE.Euler(), giro: new THREE.Vector3() })); // Para cada papelito: posición, velocidad, rotación y velocidad de giro.
  const auxiliar = new THREE.Object3D(); // Objeto temporal que uso para calcular la matriz de cada papelito.
  let activo = false; // true mientras el confeti está cayendo.

  return {
    lanzar(origen) { // Lanza el confeti desde un punto.
      datos.forEach((d, i) => {
        d.pos.copy(origen); // Todos nacen en el mismo punto.
        d.vel.set((Math.random() - 0.5) * 5, 4 + Math.random() * 4, (Math.random() - 0.3) * 4); // Velocidad inicial aleatoria, siempre hacia arriba.
        d.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); // Orientación inicial aleatoria.
        d.giro.set(Math.random() * 10, Math.random() * 10, Math.random() * 10); // Velocidad de giro aleatoria.
        instancias.setColorAt(i, colores[i % colores.length]); // Reparto los colores en ronda con el operador resto (%).
      });
      instancias.instanceColor.needsUpdate = true; // Aviso a la GPU que los colores cambiaron.
      instancias.visible = true;
      activo = true;
    },
    actualizar(dt) { // Avanza la simulación física dt segundos.
      if (!activo) return;
      let vivos = 0; // Cuántos papelitos siguen en el aire.
      datos.forEach((d, i) => {
        if (d.pos.y > -0.5) { // Mientras no haya llegado al piso...
          d.vel.y -= 9 * dt; // ...la gravedad lo acelera hacia abajo.
          d.vel.multiplyScalar(0.985); // Resistencia del aire: frena un poquito.
          d.pos.addScaledVector(d.vel, dt); // Nueva posición = posición + velocidad × tiempo.
          d.rot.x += d.giro.x * dt; // Gira sobre sí mismo.
          d.rot.y += d.giro.y * dt;
          vivos += 1;
        }
        auxiliar.position.copy(d.pos); // Paso posición y rotación al objeto auxiliar...
        auxiliar.rotation.copy(d.rot);
        auxiliar.updateMatrix(); // ...para que calcule su matriz de transformación...
        instancias.setMatrixAt(i, auxiliar.matrix); // ...y se la asigno a este papelito.
      });
      instancias.instanceMatrix.needsUpdate = true; // Aviso a la GPU que las posiciones cambiaron.
      if (vivos === 0) { // Si todos tocaron el piso, termino.
        activo = false;
        instancias.visible = false;
      }
    },
    ocultar() { // Corta el confeti al instante (al empezar otra partida).
      activo = false;
      instancias.visible = false;
    }
  };
}

// Creo la escena completa y devuelvo métodos para controlarla desde el juego.
export function crearEscena(contenedor) { // "contenedor" es el <div id="escena3d"> donde va el canvas.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // antialias suaviza los bordes; alpha permite fondo transparente (se ve el degradé del CSS).
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Nitidez en pantallas retina, pero con tope 2 para no gastar de más.
  renderer.setClearColor(0x000000, 0); // Fondo totalmente transparente.
  renderer.shadowMap.enabled = true; // Activo el cálculo de sombras.
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras con bordes suaves.
  contenedor.append(renderer.domElement); // domElement es el <canvas>: lo inserto en la página.

  const escena = new THREE.Scene(); // El "mundo" que contiene todos los objetos.
  const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 60); // Cámara en perspectiva: campo de visión 36°, proporción 1 (se corrige luego), y distancia mínima y máxima visibles.
  camara.position.set(1.4, 2.7, 7.4); // Posición inicial (x, y, z).

  const controles = new OrbitControls(camara, renderer.domElement); // Gira la cámara alrededor de un punto al arrastrar.
  controles.target.set(-0.2, 2.15, 0); // Punto que la cámara mira y alrededor del cual orbita (el pecho del muñeco).
  controles.enablePan = false; // No permito desplazar la escena.
  controles.enableZoom = false; // No permito zoom (así el scroll de la página sigue funcionando).
  controles.enableDamping = true; // Inercia: el giro se frena suavemente.
  controles.minAzimuthAngle = -0.8; // Límite de giro a la izquierda (radianes).
  controles.maxAzimuthAngle = 0.8; // Límite de giro a la derecha.
  controles.minPolarAngle = 1.05; // Límite vertical: no dejo mirar desde muy arriba...
  controles.maxPolarAngle = 1.65; // ...ni desde debajo del piso.
  controles.update(); // Aplica la configuración inicial.

  const hemisferio = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2); // Luz ambiente con color de cielo arriba y de suelo abajo.
  escena.add(hemisferio);
  const sol = new THREE.DirectionalLight(0xffffff, 2); // Luz direccional (como el sol): ilumina en una dirección y genera sombras.
  sol.position.set(3, 7, 5);
  sol.castShadow = true; // Esta luz proyecta sombras.
  sol.shadow.mapSize.set(1024, 1024); // Resolución de las sombras.
  sol.shadow.camera.left = -4; // Zona de la escena que cubren las sombras (un rectángulo)...
  sol.shadow.camera.right = 4;
  sol.shadow.camera.top = 6;
  sol.shadow.camera.bottom = -1;
  sol.shadow.bias = -0.0005; // Corrección para evitar manchas ("acné de sombra").
  escena.add(sol);
  const contraluz = new THREE.PointLight(0x2563eb, 12, 12); // Luz puntual azul desde atrás: da un borde luminoso al muñeco.
  contraluz.position.set(-2.5, 3.5, -2.5);
  escena.add(contraluz);
  const alerta = new THREE.PointLight(0xdc2626, 0, 10); // Luz roja apagada (intensidad 0): se enciende un instante al fallar.
  alerta.position.set(1.5, 2.5, 2.5);
  escena.add(alerta);

  const mundo = new THREE.Group(); // Grupo que contiene todo lo físico: al moverlo "tiembla" toda la escena.
  escena.add(mundo);

  const materiales = { // Materiales compartidos; los de suelo y plataforma cambian con el tema.
    madera: material(0x9a6a46),
    maderaOscura: material(0x6b4630),
    plataforma: material(0x8a6248),
    suelo: new THREE.MeshStandardMaterial({ color: 0x141c2e, roughness: 1 })
  };
  const suelo = new THREE.Mesh(new THREE.CircleGeometry(7, 48), materiales.suelo); // Disco de 7 unidades de radio y 48 lados.
  suelo.rotation.x = -Math.PI / 2; // El círculo nace vertical: lo acuesto girándolo 90°.
  suelo.receiveShadow = true; // Recibe las sombras de la horca.
  mundo.add(suelo);
  mundo.add(crearHorca(materiales)); // Agrego la horca.
  const taburete = crearTaburete(materiales.madera);
  mundo.add(taburete);

  // El "colgante" nace en la viga: contiene la cuerda y el muñeco, así balancearlos es girar un solo grupo.
  const colgante = new THREE.Group();
  colgante.position.set(0.4, ALTURA_VIGA, 0); // Su origen está en el punto donde se ata la cuerda.
  mundo.add(colgante);
  const cuerdaMat = material(0xd9c08a); // Color paja.
  const largoCuerda = ALTURA_VIGA - (ALTURA_TABURETE + CUELLO) - 0.05; // Largo para que el lazo quede justo en el cuello.
  const cuerda = malla(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), cuerdaMat); // Cilindro fino de altura 1 (después se estira con scale).
  colgante.add(cuerda);
  const lazo = malla(new THREE.TorusGeometry(0.15, 0.04, 6, 18), cuerdaMat); // Anillo alrededor del cuello.
  lazo.rotation.x = Math.PI / 2; // Lo acuesto horizontalmente.
  colgante.add(lazo);

  const { muneco, partes, materiales: matPartes, codos, ojos, ojosX, boca, cejas } = crearMuneco(); // Construyo el personaje.
  ponerBoca(boca, false); // Empieza sonriendo.
  colgante.add(muneco); // Cuelga del mismo grupo que la cuerda.
  const confeti = crearConfeti(escena);

  // Estado numérico que modifican las animaciones; el loop arma la pose a partir de estos valores.
  const estado = {
    modo: "espera", // "espera", "jugando", "perdida" o "ganada".
    errores: 0, // Errores actuales (partes visibles).
    tiempo: 0, // Reloj interno de la escena en segundos (alimenta senos y cosenos).
    salto: 0, // Altura extra del salto al acertar.
    sacudida: 0, // Intensidad del temblor al fallar.
    asentir: 0, // Cabeceo al acertar.
    alerta: 0, // Intensidad de la luz roja.
    caida: 0, // 0→1: cuánto se estiró la cuerda al caerse el taburete.
    taburete: 0, // 0→1: cuánto cayó el taburete.
    columpio: 0, // Amplitud del balanceo del colgado.
    soltar: 0, // 0→1: cuánto se abrió el lazo al ganar.
    liberado: 0, // 0→1: progreso del salto del muñeco al piso.
    aparicion: PARTES.map(() => 1), // Escala de aparición de cada parte (para el rebote al aparecer).
    parpadeo: 2 // Segundos hasta el próximo parpadeo.
  };
  const puntero = { x: 0, y: 0 }; // Posición del mouse sobre la escena, de -1 a 1.
  const mirada = { x: 0, y: 0 }; // Hacia dónde mira la cabeza (sigue al puntero con retraso).
  const tweens = new Set(); // Animaciones en curso; Set permite agregar y quitar fácil.

  function animar(duracion, alAvanzar, curva = suave) { // Crea una animación: durante "duracion" segundos llama a alAvanzar(valor de 0 a 1).
    if (reducirMovimiento.matches || duracion <= 0) { // Con "reducir movimiento" salto directo al final.
      alAvanzar(1);
      return Promise.resolve(); // Promesa ya resuelta: quien haga await no espera.
    }
    return new Promise((resolve) => tweens.add({ t: 0, duracion, alAvanzar, curva, resolve })); // La promesa se resuelve cuando "cuadro" termina la animación.
  }

  function fantasma(nombre, activo) { // Vuelve una parte transparente (silueta) o sólida.
    matPartes[nombre].forEach(({ mat, opacidad, transparente }) => {
      mat.transparent = activo || transparente; // Para usar opacity el material debe estar marcado como transparente.
      mat.opacity = activo ? OPACIDAD_FANTASMA : opacidad; // Casi invisible o su opacidad original.
      mat.depthWrite = !activo; // Un fantasma no tapa a los objetos de atrás.
      mat.needsUpdate = true; // Obliga a Three.js a recompilar el material.
    });
    partes[nombre].traverse((hijo) => {
      if (hijo.isMesh) hijo.castShadow = !activo; // Una silueta fantasma no proyecta sombra.
    });
  }

  function aplicarTema(oscuro) { // Recolorea la escena según el tema.
    const tema = oscuro ? TEMAS.oscuro : TEMAS.claro;
    materiales.suelo.color.setHex(tema.suelo);
    materiales.plataforma.color.setHex(tema.plataforma);
    hemisferio.color.setHex(tema.cielo);
    hemisferio.groundColor.setHex(tema.tierra);
    hemisferio.intensity = tema.hemisferio;
    sol.intensity = tema.sol;
    contraluz.intensity = oscuro ? 14 : 4; // La luz azul de fondo se nota más en el modo oscuro.
  }

  // Compongo la pose de cada cuadro: base + respiración + reacciones + final de partida.
  function componerPose(dt) { // Se llama en cada cuadro; recalcula posición y rotación de todo desde cero.
    const t = estado.tiempo;
    const mover = !reducirMovimiento.matches; // false si hay que evitar movimiento decorativo.
    const nervios = estado.errores / PARTES.length; // 0 a 1: qué tan nervioso está según los errores.

    mirada.x = mezclar(mirada.x, puntero.x, Math.min(1, dt * 4)); // La mirada se acerca al puntero de a poco (suavizado).
    mirada.y = mezclar(mirada.y, puntero.y, Math.min(1, dt * 4));

    const caida = 0.14 * estado.caida; // Cuánto se estira la cuerda al caerse el taburete.
    const largo = largoCuerda + caida; // Largo actual de la cuerda.
    const subir = estado.soltar * 1.1; // Al ganar, la cuerda se recoge hacia arriba.
    cuerda.scale.y = Math.max(0.05, largo - subir); // Estiro el cilindro (de altura 1) al largo necesario.
    cuerda.position.y = -(largo - subir) / 2; // Lo centro entre la viga y el lazo.
    lazo.position.y = -largo - 0.07 + subir; // El lazo va en el extremo inferior de la cuerda.
    lazo.scale.setScalar(1 + estado.soltar * 0.8); // Al ganar el lazo se abre (se agranda).

    muneco.position.set(0, -(ALTURA_VIGA - ALTURA_TABURETE) - caida, 0); // Pose base: parado sobre el taburete.
    muneco.rotation.set(0, 0, 0);
    partes.cabeza.rotation.set(-mirada.y * 0.25, mirada.x * 0.6, 0); // La cabeza gira hacia donde apunta el mouse.
    partes.brazoIzq.rotation.set(0, 0, -0.1); // Brazos ligeramente separados del cuerpo.
    partes.brazoDer.rotation.set(0, 0, 0.1);
    codos.brazoIzq.rotation.set(0, 0, 0.12); // Codos apenas flexionados.
    codos.brazoDer.rotation.set(0, 0, -0.12);
    partes.piernaIzq.rotation.set(0, 0, 0);
    partes.piernaDer.rotation.set(0, 0, 0);

    if (mover) { // Respiración y nerviosismo.
      muneco.position.y += Math.sin(t * 2.2) * 0.012; // Sube y baja apenas, como al respirar.
      muneco.rotation.z = Math.sin(t * 1.4) * 0.015 * (1 + nervios * 4); // Se mece más cuanto más nervioso está.
      partes.brazoIzq.rotation.z -= Math.sin(t * 2.2) * 0.03 + Math.sin(t * 31) * 0.02 * nervios; // Temblor rápido de brazos que crece con los errores.
      partes.brazoDer.rotation.z += Math.sin(t * 2.2) * 0.03 + Math.sin(t * 29) * 0.02 * nervios;
    }

    // Saludo: brazo izquierdo abierto a la altura del hombro y el antebrazo hacia arriba moviéndose de lado a lado.
    if (estado.modo === "espera" && mover) {
      partes.brazoIzq.rotation.set(0.3, 0, -1.25 + Math.sin(t * 3) * 0.06); // Brazo levantado hacia el costado y un poco adelante.
      codos.brazoIzq.rotation.z = -1.45 + Math.sin(t * 7) * 0.45; // Antebrazo doblado hacia arriba que oscila: el "hola".
      codos.brazoDer.rotation.z = -0.25; // El otro brazo, relajado.
      partes.brazoDer.rotation.z = 0.18;
      partes.cabeza.rotation.z = -0.1 + Math.sin(t * 3) * 0.05; // Cabeza ladeada simpática.
    }

    muneco.position.y += estado.salto; // Salto al acertar.
    partes.cabeza.rotation.x += estado.asentir; // Cabeceo al acertar.
    mundo.position.x = mover ? Math.sin(t * 55) * 0.035 * estado.sacudida : 0; // Temblor horizontal de toda la escena al fallar.
    alerta.intensity = estado.alerta * 18; // Destello rojo al fallar.

    // Expresión: las cejas se preocupan con cada error y desde el cuarto deja de sonreír.
    if (estado.modo === "jugando") ponerBoca(boca, estado.errores >= 4); // Boca triste desde 4 errores.
    const preocupacion = estado.modo === "jugando" || estado.modo === "perdida" ? Math.min(1, nervios * 1.5) : 0; // Cuánto fruncir las cejas (0 a 1).
    cejas[0].rotation.z = 0.45 * preocupacion; // Cejas inclinadas hacia adentro = cara de preocupación.
    cejas[1].rotation.z = -0.45 * preocupacion;
    cejas[0].position.y = cejas[1].position.y = 0.62 + (estado.modo === "ganada" ? 0.03 : 0); // Al ganar, las cejas suben (alegría).

    // Parpadeo cada tantos segundos.
    estado.parpadeo -= dt; // Cuenta regresiva.
    if (estado.parpadeo < 0) estado.parpadeo = 2.5 + Math.random() * 2.5; // Reinicia con un tiempo al azar entre 2,5 y 5 s.
    ojos.scale.y = estado.parpadeo < 0.12 ? 0.15 : 1; // Durante 0,12 s los ojos se aplastan: parpadeo.

    PARTES.forEach((nombre, i) => {
      const p = estado.aparicion[i];
      partes[nombre].scale.setScalar(mezclar(0.4, 1, p)); // Cada parte crece de 40 % a 100 % al aparecer.
    });

    if (estado.caida > 0) { // Pose de colgado: cabeza caída y miembros flojos.
      const c = estado.caida;
      partes.cabeza.rotation.set(mezclar(partes.cabeza.rotation.x, 0.3, c), mezclar(partes.cabeza.rotation.y, 0, c), 0.35 * c); // Cabeza inclinada hacia adelante y al costado.
      partes.brazoIzq.rotation.z = mezclar(partes.brazoIzq.rotation.z, -0.03, c); // Brazos colgando.
      partes.brazoDer.rotation.z = mezclar(partes.brazoDer.rotation.z, 0.03, c);
      codos.brazoIzq.rotation.z = mezclar(codos.brazoIzq.rotation.z, 0, c);
      codos.brazoDer.rotation.z = mezclar(codos.brazoDer.rotation.z, 0, c);
      partes.piernaIzq.rotation.x = 0.08 * c; // Piernas ligeramente descompensadas.
      partes.piernaDer.rotation.x = -0.05 * c;
      muneco.rotation.z = 0;
    }
    colgante.rotation.z = mover ? Math.sin(t * 2.1) * estado.columpio : 0; // Balanceo del péndulo cuerda + muñeco.
    taburete.rotation.z = -1.45 * estado.taburete; // El taburete se vuelca (rota alrededor de su pata).
    taburete.position.x = 0.75 + 0.35 * estado.taburete; // Y se desplaza un poco al caer.

    if (estado.modo === "ganada") { // Pose de victoria.
      const l = estado.liberado;
      muneco.position.x = mezclar(0, 0.55, l); // Se corre hacia adelante y a un costado...
      muneco.position.z = mezclar(0, 0.85, l);
      muneco.position.y = mezclar(muneco.position.y, 0.3 - ALTURA_VIGA, l) + Math.sin(l * Math.PI) * 0.9; // ...baja al piso con un arco de salto (el seno hace la parábola).
      if (l >= 1) { // Ya aterrizó: festeja.
        const salto = mover ? Math.abs(Math.sin(t * 5)) * 0.28 : 0; // Saltitos continuos (valor absoluto del seno = rebotes).
        muneco.position.y += salto;
        muneco.rotation.y = mover ? Math.sin(t * 1.7) * 0.6 : 0; // Gira de un lado a otro.
        const ritmo = mover ? Math.sin(t * 10) : 0; // Ritmo del festejo.
        partes.brazoIzq.rotation.z = -2.55 - ritmo * 0.15; // Brazos en V hacia arriba...
        partes.brazoDer.rotation.z = 2.55 + ritmo * 0.15;
        codos.brazoIzq.rotation.z = 0.35 + ritmo * 0.3; // ...con los codos marcando el ritmo.
        codos.brazoDer.rotation.z = -0.35 - ritmo * 0.3;
        partes.piernaIzq.rotation.z = -salto * 0.4; // Las piernas se abren al saltar.
        partes.piernaDer.rotation.z = salto * 0.4;
      }
    }
  }

  function cuadro(marca) { // Se ejecuta en cada cuadro de animación (~60 veces por segundo); "marca" es el tiempo en milisegundos.
    const dt = Math.min(0.1, (marca - (cuadro.anterior ?? marca)) / 1000); // dt = segundos desde el cuadro anterior, con tope 0,1 s para evitar saltos tras una pausa.
    cuadro.anterior = marca; // Guardo la marca (una función en JS puede tener propiedades).
    estado.tiempo += dt; // Avanza el reloj de la escena.
    tweens.forEach((tween) => { // Avanzo todas las animaciones activas.
      tween.t += dt;
      const p = Math.min(1, tween.t / tween.duracion); // Progreso de 0 a 1.
      tween.alAvanzar(tween.curva(p)); // Aplico la curva de suavizado y entrego el valor.
      if (p >= 1) { // Terminó.
        tweens.delete(tween); // La saco del conjunto.
        tween.resolve(); // Resuelvo su promesa: quien hizo await continúa.
      }
    });
    componerPose(dt); // Calculo la pose de todo.
    confeti.actualizar(dt); // Muevo el confeti.
    controles.update(); // Aplico la inercia de la cámara.
    renderer.render(escena, camara); // Dibujo la escena vista desde la cámara.
  }

  // Pauso el render cuando la pestaña no se ve para no gastar batería.
  const arrancar = () => {
    cuadro.anterior = undefined; // Reinicio la marca para que el primer dt tras reanudar no sea enorme.
    renderer.setAnimationLoop(cuadro); // Three.js llama a "cuadro" en cada refresco de pantalla (usa requestAnimationFrame por dentro).
  };
  document.addEventListener("visibilitychange", () => (document.hidden ? renderer.setAnimationLoop(null) : arrancar())); // Pestaña oculta: detengo el loop; visible: lo reanudo.
  arrancar();

  const ajustarTamano = () => { // Adapta el canvas al tamaño del contenedor.
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    if (!ancho || !alto) return; // Si todavía no tiene tamaño (oculto), no hago nada.
    renderer.setSize(ancho, alto, false); // false = no tocar el estilo CSS del canvas (ya lo maneja el CSS).
    camara.aspect = ancho / alto; // Proporción correcta para que no se deforme.
    // En pantallas angostas alejo la cámara para que entre toda la horca.
    camara.position.setLength(ancho / alto < 1 ? 9.5 : 7.9); // Distancia al origen: más lejos si es vertical (celular).
    camara.updateProjectionMatrix(); // Recalcula la proyección con la nueva proporción.
  };
  new ResizeObserver(ajustarTamano).observe(contenedor); // Se ejecuta cada vez que cambia el tamaño del contenedor.
  ajustarTamano();

  contenedor.addEventListener("pointermove", (evento) => { // Mouse o dedo moviéndose sobre la escena.
    const caja = contenedor.getBoundingClientRect(); // Posición y tamaño del contenedor en pantalla.
    puntero.x = ((evento.clientX - caja.left) / caja.width) * 2 - 1; // Convierto a rango -1 (izquierda) a 1 (derecha).
    puntero.y = -(((evento.clientY - caja.top) / caja.height) * 2 - 1); // Rango -1 (abajo) a 1 (arriba): el signo menos invierte el eje de la pantalla.
  });
  contenedor.addEventListener("pointerleave", () => { // Al salir el puntero, la mirada vuelve al centro.
    puntero.x = 0;
    puntero.y = 0;
  });

  function reiniciarEstado(modo) { // Deja todo en valores de reposo al cambiar de situación.
    tweens.clear(); // Cancelo animaciones pendientes.
    confeti.ocultar();
    Object.assign(estado, { modo, errores: 0, salto: 0, sacudida: 0, asentir: 0, alerta: 0, caida: 0, taburete: 0, columpio: 0, soltar: 0, liberado: 0 }); // Object.assign sobreescribe varias propiedades de golpe.
    ojos.visible = true; // Ojos normales.
    ojosX.visible = false; // Sin X.
    ponerBoca(boca, false); // Sonrisa.
    boca.scale.setScalar(1);
  }

  return { // API pública que usa main.js.
    aplicarTema,

    // Nueva partida: el muñeco queda como silueta transparente sobre el taburete.
    preparar() {
      reiniciarEstado("jugando");
      PARTES.forEach((nombre, i) => {
        fantasma(nombre, true); // Todas las partes como silueta.
        estado.aparicion[i] = 1;
      });
    },

    // Vuelvo a la pantalla de espera con el muñeco completo saludando.
    esperar() {
      reiniciarEstado("espera");
      PARTES.forEach((nombre, i) => {
        fantasma(nombre, false); // Todas sólidas.
        estado.aparicion[i] = 1;
      });
    },

    // Solidifico las partes que correspondan a la cantidad de errores, con un pequeño rebote.
    mostrarErrores(errores, animarAparicion = true) {
      PARTES.forEach((nombre, i) => {
        const debeVerse = i < errores; // Con 2 errores deben verse las partes 0 y 1.
        const yaSeVe = i < estado.errores; // Las que ya estaban visibles antes.
        if (debeVerse && !yaSeVe) { // Solo animo las partes nuevas.
          fantasma(nombre, false);
          if (animarAparicion) {
            estado.aparicion[i] = 0; // Empieza chica...
            animar(0.55, (p) => { estado.aparicion[i] = p; }, rebote); // ...y crece con rebote.
          }
        }
      });
      estado.errores = errores;
    },

    reaccionar(tipo) { // Reacción breve a cada jugada.
      if (tipo === "acierto") {
        animar(0.4, (p) => { estado.salto = Math.sin(p * Math.PI) * 0.18; }, salida); // Saltito hacia arriba y abajo.
        animar(0.5, (p) => { estado.asentir = Math.sin(p * Math.PI * 2) * 0.22; }); // Asiente con la cabeza.
        boca.scale.setScalar(1.35); // Sonrisa agrandada...
        animar(0.8, (p) => boca.scale.setScalar(mezclar(1.35, 1, p))); // ...que vuelve a su tamaño.
      } else {
        animar(0.45, (p) => { estado.sacudida = 1 - p; }, salida); // Temblor que se apaga.
        animar(0.6, (p) => { estado.alerta = Math.sin(p * Math.PI); }); // Destello rojo que sube y baja.
      }
    },

    // Derrota: se cae el taburete, el muñeco queda colgando y se balancea cada vez menos.
    async perder() {
      estado.modo = "perdida";
      ponerBoca(boca, true);
      animar(0.6, (p) => { estado.alerta = Math.sin(p * Math.PI); }); // Destello rojo (sin await: corre en paralelo).
      await animar(0.45, (p) => { estado.taburete = p; }, salida); // Espero a que el taburete termine de caer.
      ojos.visible = false; // Cambio los ojos por X.
      ojosX.visible = true;
      estado.columpio = 0.22; // Amplitud inicial del balanceo.
      animar(0.35, (p) => { estado.caida = p; }, rebote); // La cuerda se estira con un rebote.
      await animar(3.5, (p) => { estado.columpio = mezclar(0.22, 0.035, p); }, salida); // El balanceo se va amortiguando.
    },

    // Victoria: se abre el lazo, el muñeco salta al piso y festeja con confeti.
    async ganar() {
      estado.modo = "ganada";
      ponerBoca(boca, false);
      boca.scale.setScalar(1.5); // Sonrisa grande.
      // Al ganar el muñeco aparece completo: lo salvaste antes de que lo dibujaran.
      PARTES.forEach((nombre, i) => {
        if (i < estado.errores) return; // Las partes que ya eran visibles no se animan de nuevo.
        fantasma(nombre, false); // Las partes que faltaban se vuelven sólidas...
        estado.aparicion[i] = 0;
        animar(0.45, (p) => { estado.aparicion[i] = p; }, rebote); // ...con rebote.
      });
      await animar(0.45, (p) => { estado.soltar = p; }, salida); // Se abre el lazo.
      await animar(0.75, (p) => { estado.liberado = p; }, suave); // El muñeco salta al piso.
      if (!reducirMovimiento.matches) confeti.lanzar(new THREE.Vector3(0.9, 2.2, 0.9)); // Lanzo el confeti sobre el muñeco.
    },

    describir() { // Texto para lectores de pantalla según la situación.
      if (estado.modo === "espera") return "Muñeco 3D saludando junto a la horca, esperando una partida.";
      if (estado.modo === "perdida") return "El muñeco quedó colgado: partida perdida.";
      if (estado.modo === "ganada") return "El muñeco se liberó y festeja: partida ganada.";
      return `Muñeco 3D: ${estado.errores} de ${PARTES.length} partes dibujadas.`;
    }
  };
}
