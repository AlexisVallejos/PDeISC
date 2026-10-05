import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  registration: UseFormRegisterReturn;
  isRegister: boolean;
}

// campo de contraseña con el botón del ojo para verla
export function PasswordInput({ registration, isRegister }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-wrap">
      <input
        type={visible ? "text" : "password"}
        placeholder="Tu contraseña"
        maxLength={72}
        autoComplete={isRegister ? "new-password" : "current-password"}
        {...registration}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </span>
  );
}
