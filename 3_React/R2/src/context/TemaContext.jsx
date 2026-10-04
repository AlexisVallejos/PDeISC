import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

// contexto separado solo para el tema, para no mezclarlo con las tareas
const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [tema, setTema] = useLocalStorage("tema", "claro");

  // cada vez que cambia el tema, le pongo un atributo al html
  // para que el css sepa que colores usar
  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
  }, [tema]);

  function cambiarTema() {
    setTema((actual) => (actual === "claro" ? "oscuro" : "claro"));
  }

  return (
    <TemaContext.Provider value={{ tema, cambiarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error("useTema tiene que usarse dentro de un TemaProvider");
  }
  return contexto;
}
