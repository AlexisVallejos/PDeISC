const domArea = document.getElementById("domArea");
const message = document.getElementById("message");

const colors = ["#16803c", "#c2410c", "#7c3aed", "#0f766e", "#be123c"];
const imageSources = [
  "https://picsum.photos/id/1015/640/400",
  "https://picsum.photos/id/1039/640/400"
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

  let image = document.getElementById("domImage");

  if (!image) {
    image = document.createElement("img");
    image.id = "domImage";
    image.className = "dom-image";
    image.alt = "Paisaje generado para practicar DOM";
    image.src = imageSources[imageIndex];
    domArea.appendChild(image);
  }

  return image;
}

document.getElementById("btnAddTitle").addEventListener("click", () => {
  getOrCreateTitle();
  message.textContent = "Se agrego el componente H1 con el texto Hola DOM.";
});

document.getElementById("btnChangeText").addEventListener("click", () => {
  const title = getOrCreateTitle();
  title.textContent = "Chau DOM";
  message.textContent = "Se cambio el texto del H1 a Chau DOM.";
});

document.getElementById("btnChangeColor").addEventListener("click", () => {
  const title = getOrCreateTitle();
  colorIndex = (colorIndex + 1) % colors.length;
  title.style.color = colors[colorIndex];
  message.textContent = `Se cambio el color del H1 a ${colors[colorIndex]}.`;
});

document.getElementById("btnAddImage").addEventListener("click", () => {
  getOrCreateImage();
  message.textContent = "Se agrego una imagen al documento.";
});

document.getElementById("btnChangeImage").addEventListener("click", () => {
  const image = getOrCreateImage();
  imageIndex = (imageIndex + 1) % imageSources.length;
  image.src = imageSources[imageIndex];
  message.textContent = "Se cambio el atributo src de la imagen.";
});

document.getElementById("btnResizeImage").addEventListener("click", () => {
  const image = getOrCreateImage();
  sizeIndex = (sizeIndex + 1) % sizes.length;
  image.className = `dom-image ${sizes[sizeIndex]}`.trim();
  message.textContent = "Se cambio el tamano de la imagen.";
});

