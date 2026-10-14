import { NextResponse, type NextRequest } from "next/server";

// Chequeo optimista: sin la cookie de sesión de la API no tiene sentido abrir el panel.
// La sesión real (y el rol) los valida la API en cada pedido.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("r5_session")) return NextResponse.redirect(new URL("/ingresar", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/perfil", "/usuarios"],
};
