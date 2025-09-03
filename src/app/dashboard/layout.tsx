"use client";

import { useAuth } from "@/context/AuthContext";
import { MockDataProvider } from "@/context/MockDataContext";
import { SectionProvider } from "@/context/SectionContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Mock user para desenvolvimento
  const isDevelopment = process.env.NODE_ENV === "development";
  const mockUser = {
    id: "dev-admin",
    name: "Admin Desenvolvimento",
    email: "admin@dev.local",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  useEffect(() => {
    // Em desenvolvimento, permitir acesso direto
    if (isDevelopment) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/dashboard");
    }
  }, [isAuthenticated, isLoading, router, isDevelopment]);

  // Em desenvolvimento, usar mock user se não autenticado
  const currentUser = isDevelopment && !user ? mockUser : user;
  const currentIsAuthenticated = isDevelopment || isAuthenticated;

  // Show loading while checking auth (apenas em produção)
  if (!isDevelopment && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (apenas em produção)
  if (!isDevelopment && (!currentIsAuthenticated || !currentUser)) {
    return null;
  }

  // Check if user has permission to access dashboard
  const hasPermission =
    currentUser?.role?.toLowerCase() === "admin" ||
    currentUser?.role?.toLowerCase() === "super_admin";

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Acesso Negado
          </h1>
          <p className="text-text-muted mb-4">
            Você não tem permissão para acessar o dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <MockDataProvider>
      <SectionProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Indicador de modo desenvolvimento */}
          {isDevelopment && !user && (
            <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
              🛠️ MODO DESENVOLVIMENTO - Usuário: {mockUser.name} (
              {mockUser.role})
            </div>
          )}
          <DashboardHeader user={currentUser} />
          <main className="container mx-auto px-6 py-8">{children}</main>
        </div>
      </SectionProvider>
    </MockDataProvider>
  );
}
