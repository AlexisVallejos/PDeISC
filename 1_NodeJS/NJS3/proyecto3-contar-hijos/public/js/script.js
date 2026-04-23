const tabs = document.querySelectorAll(".tab");
const components = document.querySelectorAll(".component");
const result = document.getElementById("result");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    components.forEach((component) => component.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

document.querySelectorAll(".count-button").forEach((button) => {
  button.addEventListener("click", () => {
    const component = button.closest(".component");
    const childList = component.querySelector(".child-list");
    const amount = childList.children.length;
    const label = childList.dataset.label;

    result.textContent = `El componente "${component.querySelector("h2").textContent}" tiene ${amount} hijos (${label}).`;
  });
});

