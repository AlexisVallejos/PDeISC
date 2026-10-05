import type { ReactNode } from "react";

interface ChecklistRuleProps {
  ok: boolean;
  children: ReactNode;
}

// una línea de la lista de requisitos (✓ si se cumple, × si no)
export function ChecklistRule({ ok, children }: ChecklistRuleProps) {
  return <li className={ok ? "valid" : "invalid"}>{ok ? "✓" : "×"} {children}</li>;
}
