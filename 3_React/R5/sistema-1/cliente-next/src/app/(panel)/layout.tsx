import type { ReactNode } from "react";
import { AuthGate } from "@/components/guards/AuthGate";
import { PanelShell } from "@/components/nexo/PanelShell";

// todo lo que está en (panel) necesita sesión
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate need="user">
      <PanelShell>{children}</PanelShell>
    </AuthGate>
  );
}
