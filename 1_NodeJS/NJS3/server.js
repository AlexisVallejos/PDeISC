const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.enable("strict routing");

// Esta lista alimenta el portal principal y el endpoint /api/projects.
const projects = [
  {
    slug: "proyecto1-dom-basico",
    title: "Proyecto 1",
    description: "Eventos DHTML sobre H1 e imagen."
  },
  {
    slug: "proyecto2-eventos-componentes",
    title: "Proyecto 2",
    description: "Navegacion entre componentes con distintos eventos."
  },
  {
    slug: "proyecto3-contar-hijos",
    title: "Proyecto 3",
    description: "Conteo dinamico de hijos por componente."
  },
  {
    slug: "proyecto4-nodos-atributos",
    title: "Proyecto 4",
    description: "Creacion de nodos a y cambios de atributos."
  },
  {
    slug: "proyecto5-innerhtml",
    title: "Proyecto 5",
    description: "Insercion de objetos HTML con innerHTML."
  },
  {
    slug: "proyecto6-formulario-registro",
    title: "Proyecto 6",
    description: "Formulario de registro con resultado dinamico."
  }
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Cada proyecto expone su carpeta public desde una ruta propia.
projects.forEach((project) => {
  const projectPublicDir = path.join(__dirname, project.slug, "public");
  const route = `/${project.slug}`;

  app.get(route, (req, res) => {
    res.redirect(`${route}/`);
  });

  app.use(route, express.static(projectPublicDir));
});

const server = app.listen(PORT, () => {
  console.log(`NJS3 disponible en http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${PORT} ya esta en uso. Cierra el proceso anterior o libera ese puerto.`);
    process.exit(1);
  }

  throw error;
});
