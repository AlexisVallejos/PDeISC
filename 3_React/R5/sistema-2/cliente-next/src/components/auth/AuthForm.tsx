"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Field } from "@/components/common/Field";
import { PasswordInput } from "@/components/common/PasswordInput";
import { EmailChecklist, PasswordChecklist } from "./Checklists";
import { SocialButtons } from "./SocialButtons";
import { useAuthPage } from "@/hooks/useAuthPage";
import { emailRules } from "@/validation/emailRules";
import { nameRules } from "@/validation/nameRules";
import { passwordRules } from "@/validation/passwordRules";
import { onlyLetters } from "@/utils/onlyLetters";
import type { AuthValues } from "@/services/authService";

interface AuthFormProps {
  mode: "login" | "register";
  title: ReactNode;
  subtitle: string;
  // cada sistema puede envolver el botón principal (por ejemplo, con Magnet)
  wrapSubmit?: (button: ReactNode) => ReactNode;
  className?: string;
}

// formulario de ingreso y de registro con las mismas reglas que valida la API
export function AuthForm({ mode, title, subtitle, wrapSubmit = (button) => button, className = "" }: AuthFormProps) {
  const { busy, message, submit, social, switchHref } = useAuthPage(mode);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthValues>({ mode: "onChange" });
  const isRegister = mode === "register";
  const email = watch("email", "");
  const password = watch("password", "");

  const submitButton = (
    <button className="btn btn-primary btn-block" disabled={busy}>
      {busy ? "Procesando..." : isRegister ? "Crear cuenta" : "Iniciar sesión"}
      <ArrowRight aria-hidden="true" />
    </button>
  );

  return (
    <form className={`auth-form ${className}`} onSubmit={handleSubmit(submit)} noValidate>
      <header className="auth-head">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>

      {isRegister && (
        <Field label="Nombre" htmlFor="nombre" error={errors.nombre?.message}>
          <input id="nombre" placeholder="Solo letras y espacios" maxLength={80} autoComplete="name" {...register("nombre", nameRules)} onInput={onlyLetters} />
        </Field>
      )}

      <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" placeholder="nombre@correo.com" maxLength={120} autoComplete="email" {...register("email", emailRules)} />
      </Field>
      {isRegister && <EmailChecklist email={email} />}

      <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" registration={register("password", passwordRules)} autoComplete={isRegister ? "new-password" : "current-password"} />
      </Field>
      {isRegister && <PasswordChecklist password={password} />}

      {message && <p className="notice notice-error" role="alert">{message}</p>}

      {wrapSubmit(submitButton)}

      <SocialButtons isRegister={isRegister} busy={busy} onSelect={social} />

      <p className="auth-switch">
        {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"} <Link href={switchHref}>{isRegister ? "Iniciá sesión" : "Registrate"}</Link>
      </p>
    </form>
  );
}
