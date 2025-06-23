import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso a assets estáticos e API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") // arquivos estáticos
  ) {
    return NextResponse.next();
  }

  // Páginas públicas que não precisam de autenticação
  const publicPaths = ["/", "/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // Se está tentando acessar uma página protegida (dashboard)
  if (pathname.startsWith("/dashboard")) {
    // Em desenvolvimento, permitir acesso sem token
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_ENABLE_AUTH !== "true"
    ) {
      console.log(
        "🔓 [DEV MODE] BemMeCare - Permitindo acesso ao dashboard sem autenticação"
      );
      return NextResponse.next();
    }

    // Em produção, sempre permitir que o dashboard se encarregue da validação
    // Não verificar cookies aqui - deixar para o layout do dashboard
    console.log(
      "🔄 BemMeCare - Permitindo acesso ao dashboard - validação será feita no layout"
    );
    return NextResponse.next();
  }

  // Permitir acesso a páginas públicas
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Para outras rotas, permitir acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
