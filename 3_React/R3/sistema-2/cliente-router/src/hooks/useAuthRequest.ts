import { useState } from "react";
import { getMessage } from "@/services/api";

// maneja el "procesando" y el mensaje de error de login / registro
export function useAuthRequest() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // devuelve el usuario, o null si falló
  async function send<TValues, TResult>(action: (values: TValues) => Promise<TResult>, values: TValues): Promise<TResult | null> {
    setBusy(true);
    setMessage("");
    try {
      return await action(values);
    } catch (error) {
      setMessage(getMessage(error));
      return null;
    } finally {
      setBusy(false);
    }
  }

  const clearMessage = () => setMessage("");

  return { busy, message, send, clearMessage };
}
