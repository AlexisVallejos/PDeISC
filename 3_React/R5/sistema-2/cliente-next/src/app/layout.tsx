import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { PaperGrain } from "@/components/estudio/PaperGrain";
import { themeScript } from "@/utils/theme";
import "./globals.css";

// Fraunces es variable (peso, tamaño óptico y «suavidad»): VariableProximity la deforma cerca del puntero
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", style: ["normal", "italic"], axes: ["opsz", "SOFT"] });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Estudio / Usuarios", template: "%s · Estudio" },
  description: "Gestión de personas con ingreso por correo y redes sociales.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#fbf8f2", colorScheme: "light dark" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <PaperGrain />
      </body>
    </html>
  );
}
