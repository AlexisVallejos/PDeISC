const domArea = document.getElementById("domArea");
const message = document.getElementById("message");

const colors = ["#c66b3d", "#16803c", "#7c3aed", "#0f766e", "#be123c"];
const imageSources = [
  "https://picsum.photos/id/1015/640/400",
  "https://picsum.photos/id/1039/640/400",
  "https://picsum.photos/id/1043/640/400"
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

function addTitle() {
  getOrCreateTitle();
  message.textContent = 'Se agrego el componente H1 con el texto "Hola DOM".';
}

function changeTitleText() {
  const title = getOrCreateTitle();
  title.textContent = "Chau DOM";
  message.textContent = 'El texto del H1 cambio a "Chau DOM".';
}

function changeTitleColor() {
  const title = getOrCreateTitle();
  colorIndex = (colorIndex + 1) % colors.length;
  title.style.color = colors[colorIndex];
  message.textContent = `El color del H1 cambio a ${colors[colorIndex]}.`;
}

function addImage() {
  getOrCreateImage();
  message.textContent = "Se agrego una imagen al escenario DOM.";
}

function changeImage() {
  const image = getOrCreateImage();
  imageIndex = (imageIndex + 1) % imageSources.length;
  image.src = imageSources[imageIndex];
  message.textContent = "La imagen fue reemplazada por otra diferente.";
}

function resizeImage() {
  const image = getOrCreateImage();
  sizeIndex = (sizeIndex + 1) % sizes.length;
  image.className = `dom-image ${sizes[sizeIndex]}`.trim();

  const sizeLabel = sizes[sizeIndex] || "normal";
  message.textContent = `El tamano de la imagen cambio a ${sizeLabel}.`;
}

document.getElementById("addTitleButton").addEventListener("click", addTitle);
document.getElementById("changeTitleTextButton").addEventListener("click", changeTitleText);
document.getElementById("changeTitleColorButton").addEventListener("click", changeTitleColor);
document.getElementById("addImageButton").addEventListener("click", addImage);
document.getElementById("changeImageButton").addEventListener("click", changeImage);
document.getElementById("resizeImageButton").addEventListener("click", resizeImage);
