const domArea = document.getElementById("domArea");
const message = document.getElementById("message");

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

function clearEmptyState() {
  const emptyState = domArea.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }
}

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

function addTitle() {
  const existingTitle = document.getElementById("domTitle");

  if (existingTitle) {
    message.textContent = "El H1 ya esta agregado en el area de practica.";
    return;
  }

  getOrCreateTitle();
  message.textContent = 'Se agrego el H1 con el texto "Hola DOM".';
}

function changeTitleText() {
  const title = getOrCreateTitle();
  // Alterna entre los dos textos pedidos en el enunciado.
  const nextText = title.textContent === "Hola DOM" ? "Chau DOM" : "Hola DOM";

  title.textContent = nextText;
  message.textContent = `El texto del H1 se actualizo a "${nextText}".`;
}

function changeTitleColor() {
  const title = getOrCreateTitle();
  colorIndex = (colorIndex + 1) % colors.length;
  title.style.color = colors[colorIndex];
  message.textContent = `El color del H1 se actualizo a ${colors[colorIndex]}.`;
}

function addImage() {
  const existingImage = document.getElementById("domImage");

  if (existingImage) {
    message.textContent = "La imagen ya esta agregada en el area de practica.";
    return;
  }

  getOrCreateImage();
  message.textContent = "Se agrego una imagen al area de practica.";
}

function changeImage() {
  const image = getOrCreateImage();
  imageIndex = (imageIndex + 1) % imageSources.length;
  image.src = imageSources[imageIndex];
  message.textContent = "La imagen se actualizo correctamente.";
}

function resizeImage() {
  const image = getOrCreateImage();
  // Recorre los tamanos disponibles en cada clic.
  sizeIndex = (sizeIndex + 1) % sizes.length;
  image.className = `dom-image ${sizes[sizeIndex]}`.trim();

  const sizeLabel = sizes[sizeIndex] || "normal";
  message.textContent = `El tamano de la imagen se actualizo a ${sizeLabel}.`;
}

document.getElementById("addTitleButton").addEventListener("click", addTitle);
document.getElementById("changeTitleTextButton").addEventListener("click", changeTitleText);
document.getElementById("changeTitleColorButton").addEventListener("click", changeTitleColor);
document.getElementById("addImageButton").addEventListener("click", addImage);
document.getElementById("changeImageButton").addEventListener("click", changeImage);
document.getElementById("resizeImageButton").addEventListener("click", resizeImage);
