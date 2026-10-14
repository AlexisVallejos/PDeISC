import type { Metadata } from "next";
import { ProfileView } from "@/components/nexo/ProfileView";

export const metadata: Metadata = { title: "Mi perfil" };

export default function ProfilePage() {
  return <ProfileView />;
}
