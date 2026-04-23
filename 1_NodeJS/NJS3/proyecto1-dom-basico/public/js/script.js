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

function addTitle() {
  getOrCreateTitle();
  message.textContent = "H1 agregado.";
}

function changeTitleText() {
  const title = getOrCreateTitle();
  title.textContent = "Chau DOM";
  message.textContent = "Texto actualizado.";
}

function changeTitleColor() {
  const title = getOrCreateTitle();
  colorIndex = (colorIndex + 1) % colors.length;
  title.style.color = colors[colorIndex];
  message.textContent = "Color actualizado.";
}

function addImage() {
  getOrCreateImage();
  message.textContent = "Imagen agregada.";
}

function changeImage() {
  const image = getOrCreateImage();
  imageIndex = (imageIndex + 1) % imageSources.length;
  image.src = imageSources[imageIndex];
  message.textContent = "Imagen actualizada.";
}

function resizeImage() {
  const image = getOrCreateImage();
  sizeIndex = (sizeIndex + 1) % sizes.length;
  image.className = `dom-image ${sizes[sizeIndex]}`.trim();
  message.textContent = "Tamano actualizado.";
}

window.domLab = {
  addTitle,
  changeTitleText,
  changeTitleColor,
  addImage,
  changeImage,
  resizeImage
};

console.log("Proyecto 1 cargado.");
console.log("Comandos disponibles:");
console.log("domLab.addTitle()");
console.log("domLab.changeTitleText()");
console.log("domLab.changeTitleColor()");
console.log("domLab.addImage()");
console.log("domLab.changeImage()");
console.log("domLab.resizeImage()");
