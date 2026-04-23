const form = document.getElementById("registerForm");
const result = document.getElementById("result");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const interests = formData.getAll("interests");
  const selectedInterests = interests.length > 0 ? interests.join(", ") : "Sin intereses seleccionados";

  result.innerHTML = `
    <div class="result-item"><strong>Nombre:</strong> ${formData.get("name")}</div>
    <div class="result-item"><strong>Mail:</strong> ${formData.get("email")}</div>
    <div class="result-item"><strong>Edad:</strong> ${formData.get("age")}</div>
    <div class="result-item"><strong>Genero:</strong> ${formData.get("gender")}</div>
    <div class="result-item"><strong>Provincia:</strong> ${formData.get("province")}</div>
    <div class="result-item"><strong>Intereses:</strong> ${selectedInterests}</div>
  `;
});

