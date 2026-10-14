import type { Metadata } from "next";
import { AuthGate } from "@/components/guards/AuthGate";
import { UsersView } from "@/components/atelier/UsersView";

export const metadata: Metadata = { title: "Usuarios" };

export default function UsersPage() {
  return (
    <AuthGate need="admin">
      <UsersView />
    </AuthGate>
  );
}
