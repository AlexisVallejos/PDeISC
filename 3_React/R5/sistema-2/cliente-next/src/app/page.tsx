"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/common/Loader";
import { useAuth } from "@/context/AuthContext";
import { homePath } from "@/utils/homePath";

// la portada no tiene contenido propio: manda a cada persona a su pantalla
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.replace(user ? homePath(user) : "/ingresar");
  }, [loading, user, router]);

  return <Loader text="Abriendo el estudio..." />;
}
