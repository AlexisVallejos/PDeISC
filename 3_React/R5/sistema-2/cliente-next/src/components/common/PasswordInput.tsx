"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  id: string;
  registration: UseFormRegisterReturn;
  autoComplete: string;
  placeholder?: string;
}

// contraseña con botón para mostrarla u ocultarla
export function PasswordInput({ id, registration, autoComplete, placeholder = "••••••••" }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input id={id} type={visible ? "text" : "password"} placeholder={placeholder} maxLength={72} autoComplete={autoComplete} {...registration} />
      <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={visible}>
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </button>
    </div>
  );
}
