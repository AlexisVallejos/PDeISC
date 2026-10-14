import type { Metadata } from "next";
import { AuthGate } from "@/components/guards/AuthGate";
import { AuthScreen } from "@/components/estudio/AuthScreen";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <AuthGate need="guest">
      <AuthScreen mode="login" />
    </AuthGate>
  );
}
