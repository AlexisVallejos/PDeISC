import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

function Rule({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <li className={ok ? "is-ok" : ""}>
      {ok ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
      <span>{children}</span>
      <span className="sr-only">{ok ? "(cumplido)" : "(pendiente)"}</span>
    </li>
  );
}

export function EmailChecklist({ email = "" }: { email?: string }) {
  return (
    <ul className="rules">
      <Rule ok={email.includes("@")}>Incluye @</Rule>
      <Rule ok={/\.[A-Za-z]{2,}$/.test(email)}>Termina en un dominio, como .com</Rule>
    </ul>
  );
}

export function PasswordChecklist({ password = "" }: { password?: string }) {
  return (
    <ul className="rules">
      <Rule ok={password.length >= 8}>8 caracteres</Rule>
      <Rule ok={/[A-Z]/.test(password)}>Una mayúscula</Rule>
      <Rule ok={/[a-z]/.test(password)}>Una minúscula</Rule>
      <Rule ok={/[0-9]/.test(password)}>Un número</Rule>
      <Rule ok={/[^A-Za-z0-9\s]/.test(password)}>Un carácter especial</Rule>
    </ul>
  );
}
