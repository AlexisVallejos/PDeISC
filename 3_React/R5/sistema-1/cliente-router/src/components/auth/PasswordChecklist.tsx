import { ChecklistRule } from "./ChecklistRule";

export function PasswordChecklist({ password = "" }: { password?: string }) {
  return (
    <ul className="live-rules">
      <ChecklistRule ok={password.length >= 8}>Al menos 8 caracteres</ChecklistRule>
      <ChecklistRule ok={/[A-Z]/.test(password)}>Una letra mayúscula</ChecklistRule>
      <ChecklistRule ok={/[a-z]/.test(password)}>Una letra minúscula</ChecklistRule>
      <ChecklistRule ok={/[0-9]/.test(password)}>Un número</ChecklistRule>
      <ChecklistRule ok={/[^A-Za-z0-9\s]/.test(password)}>Un carácter especial</ChecklistRule>
    </ul>
  );
}
