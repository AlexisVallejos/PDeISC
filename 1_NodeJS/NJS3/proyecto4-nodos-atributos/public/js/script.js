const linksContainer = document.getElementById("linksContainer");
const changeLog = document.getElementById("changeLog");

const originalLinks = [
  { text: "Google", href: "https://www.google.com" },
  { text: "MDN", href: "https://developer.mozilla.org" },
  { text: "Node.js", href: "https://nodejs.org" },
  { text: "Express", href: "https://expressjs.com" },
  { text: "GitHub", href: "https://github.com" }
];

const changedLinks = [
  { text: "Wikipedia", href: "https://www.wikipedia.org" },
  { text: "W3Schools", href: "https://www.w3schools.com" },
  { text: "NPM", href: "https://www.npmjs.com" },
  { text: "OpenJS", href: "https://openjsf.org" },
  { text: "Git", href: "https://git-scm.com" }
];

function writeLog(text) {
  const item = document.createElement("li");
  item.textContent = text;
  changeLog.appendChild(item);
}

function formatLogMessage(nodeNumber, attribute, previousValue, nextValue) {
  return `Nodo ${nodeNumber} | atributo: ${attribute} | valor anterior: ${previousValue} | valor nuevo: ${nextValue}`;
}

document.getElementById("createLinks").addEventListener("click", () => {
  // Reinicia el area para volver a generar exactamente 5 enlaces.
  linksContainer.innerHTML = "";
  changeLog.innerHTML = "";

  originalLinks.forEach((linkData, index) => {
    const link = document.createElement("a");
    link.id = `link-${index + 1}`;
    link.href = linkData.href;
    link.textContent = linkData.text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    linksContainer.appendChild(link);
    writeLog(formatLogMessage(index + 1, "href", "sin valor previo", linkData.href));
  });
});

document.getElementById("modifyLinks").addEventListener("click", () => {
  const links = linksContainer.querySelectorAll("a");

  if (links.length === 0) {
    writeLog("Primero debes crear los enlaces para poder modificar sus atributos.");
    return;
  }

  links.forEach((link, index) => {
    // getAttribute permite mostrar el valor anterior antes de reemplazarlo.
    const previousHref = link.getAttribute("href");
    const nextData = changedLinks[index];

    link.setAttribute("href", nextData.href);
    link.textContent = nextData.text;

    writeLog(formatLogMessage(index + 1, "href", previousHref, nextData.href));
  });
});

