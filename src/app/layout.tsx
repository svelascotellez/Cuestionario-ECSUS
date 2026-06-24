import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECSUS - Actualización de Estado Operativo",
  description: "Plataforma de estado operativo ECSUS para registro de incidencias y reportes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="imss-header">
          <h1>Sistema ECSUS</h1>
        </header>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
