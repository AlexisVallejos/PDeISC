import { useState, useEffect } from "react";

// hook para guardar cualquier estado en localStorage automaticamente
// lo uso tanto para las tareas como para el tema
function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      // si ya hay algo guardado lo uso, sino arranco con el valor inicial
      return guardado !== null ? JSON.parse(guardado) : valorInicial;
    } catch (error) {
      console.error("No se pudo leer localStorage:", error);
      return valorInicial;
    }
  });

  // cada vez que cambia el valor lo guardo de nuevo
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.error("No se pudo guardar en localStorage:", error);
    }
  }, [clave, valor]);

  return [valor, setValor];
}

export default useLocalStorage;
