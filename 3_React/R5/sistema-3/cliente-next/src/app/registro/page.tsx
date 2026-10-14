import type { Metadata } from "next";
import { AuthGate } from "@/components/guards/AuthGate";
import { AuthScreen } from "@/components/atelier/AuthScreen";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthGate need="guest">
      <AuthScreen mode="register" />
    </AuthGate>
  );
}
