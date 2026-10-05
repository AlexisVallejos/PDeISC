import { useForm } from "react-hook-form";
import { AuthArt } from "./AuthArt";
import { AuthBrand } from "./AuthBrand";
import { AuthField } from "./AuthField";
import { AuthThemeButton } from "./AuthThemeButton";
import { EmailChecklist } from "./EmailChecklist";
import { PasswordChecklist } from "./PasswordChecklist";
import { PasswordInput } from "./PasswordInput";
import { emailRules } from "@/validation/emailRules";
import { nameRules } from "@/validation/nameRules";
import { passwordRules } from "@/validation/passwordRules";
import { onlyLetters } from "@/utils/onlyLetters";
import type { AuthValues } from "@/services/authService";

interface AuthFormProps {
  mode: "login" | "register";
  busy: boolean;
  message: string;
  onSubmit: (values: AuthValues) => unknown;
  onSwitch: () => void;
}

// formulario de login y de registro (mode = "login" | "register")
export function AuthForm({ mode, busy, message, onSubmit, onSwitch }: AuthFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthValues>({ mode: "onChange" });
  const isRegister = mode === "register";
  const email = watch("email", "");
  const password = watch("password", "");

  return (
    <section className="auth-shell">
      <AuthArt />
      <form className="form card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthThemeButton />
        <AuthBrand />

        <h1>{isRegister ? "Creá tu cuenta" : "Iniciá sesión"}</h1>
        <p>{isRegister ? "Completá los requisitos para crear tu cuenta." : "Entrá para continuar con tu cuenta."}</p>

        {isRegister && (
          <AuthField label="Nombre" error={errors.nombre?.message}>
            <input placeholder="Solo letras y espacios" maxLength={80} autoComplete="name" {...register("nombre", nameRules)} onInput={onlyLetters} />
          </AuthField>
        )}

        <AuthField label="Correo electrónico" error={errors.email?.message}>
          <input type="email" placeholder="nombre@correo.com" maxLength={120} autoComplete="email" {...register("email", emailRules)} />
        </AuthField>
        {isRegister && <EmailChecklist email={email} />}

        <AuthField label="Contraseña" error={errors.password?.message}>
          <PasswordInput registration={register("password", passwordRules)} isRegister={isRegister} />
        </AuthField>
        {isRegister && <PasswordChecklist password={password} />}

        {message && <div className="auth-error" role="alert">{message}</div>}

        <button disabled={busy}>
          {busy ? "Procesando..." : isRegister ? "Crear cuenta" : "Iniciar sesión"}
          <span aria-hidden="true">→</span>
        </button>

        <p className="auth-switch">
          {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
          <button type="button" onClick={onSwitch}>{isRegister ? "Iniciá sesión" : "Registrate"}</button>
        </p>
      </form>
    </section>
  );
}
