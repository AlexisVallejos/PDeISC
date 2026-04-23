async function loadProjects() {
  const projectGrid = document.getElementById("projectGrid");

  try {
    const response = await fetch("./api/projects");
    const projects = await response.json();

    projectGrid.innerHTML = projects
      .map((project) => `
        <article class="project-card">
          <div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
          <a class="project-link" href="./${project.slug}/">Abrir proyecto</a>
        </article>
      `)
      .join("");
  } catch (error) {
    projectGrid.innerHTML = `
      <article class="project-card">
        <h3>Error</h3>
        <p>No se pudo cargar la lista de proyectos.</p>
      </article>
    `;
  }
}

loadProjects();

