import { ChecklistRule } from "./ChecklistRule";

export function EmailChecklist({ email = "" }: { email?: string }) {
  return (
    <ul className="live-rules compact">
      <ChecklistRule ok={email.includes("@")}>Debe incluir @</ChecklistRule>
      <ChecklistRule ok={/\.[A-Za-z]{2,}$/.test(email)}>Debe terminar en un dominio, como .com</ChecklistRule>
    </ul>
  );
}
