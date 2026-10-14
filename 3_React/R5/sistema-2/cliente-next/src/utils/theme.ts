export type Theme = "light" | "dark";

export const THEME_KEY = "estudio-next-theme";
export const DEFAULT_THEME: Theme = "light";

// se ejecuta antes de pintar para que no parpadee el tema guardado
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="light"||t==="dark"?t:"${DEFAULT_THEME}"}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}"}`;
