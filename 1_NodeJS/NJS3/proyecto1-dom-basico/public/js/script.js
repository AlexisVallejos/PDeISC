const domArea = document.getElementById("domArea");
const message = document.getElementById("message");

// Listas usadas para ir alternando colores, imagenes y tamanos.
const colors = ["#c66b3d", "#16803c", "#7c3aed", "#0f766e", "#be123c"];
const imageSources = [
  "./img/julian-river-1.jpg",
  "./img/river-estadio.jpg",
  "./img/julian-atletico.webp",
  "./img/julian-river-2.jpg"
];
const sizes = ["", "medium", "large"];

let colorIndex = 0;
let imageIndex = 0;
let sizeIndex = 0;

// Borra el mensaje inicial cuando ya se agrega un elemento real al DOM.
function clearEmptyState() {
  const emptyState = domArea.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }
}

// Crea el H1 si no existe y devuelve ese mismo nodo para reutilizarlo.
function getOrCreateTitle() {
  clearEmptyState();

  // Si el H1 no existe, lo crea; si ya existe, lo reutiliza.
  let title = document.getElementById("domTitle");

  if (!title) {
    title = document.createElement("h1");
    title.id = "domTitle";
    title.className = "dom-title";
    title.textContent = "Hola DOM";
    domArea.prepend(title);
  }

  return title;
}

// Crea la imagen si no existe y la devuelve para reutilizarla sin duplicarla.
function getOrCreateImage() {
  clearEmptyState();

  // Aplica la misma idea para la imagen, evitando duplicados.
  let image = document.getElementById("domImage");

  if (!image) {
    image = document.createElement("img");
    image.id = "domImage";
    image.className = "dom-image";
    image.alt = "Imagen de River y Julian Alvarez para practicar DOM";
    image.src = imageSources[imageIndex];
    domArea.appendChild(image);
  }

  return image;
}

// Agrega el H1 al area de practica.
function addTitle() {
  const existingTitle = document.getElementById("domTitle");

  if (existingTitle) {
    message.textContent = "El H1 ya esta agregado en el area de practica.";
    return;
  }

  getOrCreateTitle();
  message.textContent = 'Se agrego el H1 con el texto "Hola DOM".';
}

// Cambia el texto del H1 entre las dos opciones del ejercicio.
function changeTitleText() {
  const title = getOrCreateTitle();
  // Alterna entre los dos textos pedidos en el enunciado.
  const nextText = title.textContent === "Hola DOM" ? "Chau DOM" : "Hola DOM";

  title.textContent = nextText;
  message.textContent = `El texto del H1 se actualizo a "${nextText}".`;
}

// Recorre el arreglo de colores para cambiar el color del titulo.
function changeTitleColor() {
  const title = getOrCreateTitle();
  colorIndex = (colorIndex + 1) % colors.length;
  title.style.color = colors[colorIndex];
  message.textContent = `El color del H1 se actualizo a ${colors[colorIndex]}.`;
}

// Agrega una imagen al area de practica.
function addImage() {
  const existingImage = document.getElementById("domImage");

  if (existingImage) {
    message.textContent = "La imagen ya esta agregada en el area de practica.";
    return;
  }

  getOrCreateImage();
  message.textContent = "Se agrego una imagen al area de practica.";
}

// Reemplaza la imagen actual por otra del arreglo.
function changeImage() {
  const image = getOrCreateImage();
  imageIndex = (imageIndex + 1) % imageSources.length;
  image.src = imageSources[imageIndex];
  message.textContent = "La imagen se actualizo correctamente.";
}

// Cambia el tamano de la imagen usando clases CSS.
function resizeImage() {
  const image = getOrCreateImage();
  // Recorre los tamanos disponibles en cada clic.
  sizeIndex = (sizeIndex + 1) % sizes.length;
  image.className = `dom-image ${sizes[sizeIndex]}`.trim();

  const sizeLabel = sizes[sizeIndex] || "normal";
  message.textContent = `El tamano de la imagen se actualizo a ${sizeLabel}.`;
}

// Vincula cada boton con la accion que debe ejecutar.
document.getElementById("addTitleButton").addEventListener("click", addTitle);
document.getElementById("changeTitleTextButton").addEventListener("click", changeTitleText);
document.getElementById("changeTitleColorButton").addEventListener("click", changeTitleColor);
document.getElementById("addImageButton").addEventListener("click", addImage);
document.getElementById("changeImageButton").addEventListener("click", changeImage);
document.getElementById("resizeImageButton").addEventListener("click", resizeImage);
