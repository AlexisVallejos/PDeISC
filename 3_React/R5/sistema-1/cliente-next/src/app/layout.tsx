import type { Metadata, Viewport } from "next";
import { DM_Sans, Sora } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { themeScript } from "@/utils/theme";
import "./globals.css";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "NEXO · Control nocturno", template: "%s · NEXO" },
  description: "Gestión de personas con ingreso por correo y redes sociales.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#081321", colorScheme: "dark light" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
