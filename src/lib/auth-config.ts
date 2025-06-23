import type { User } from "@/types";

/**
 * Configuração de Autenticação para Desenvolvimento BemMeCare
 * Permite desabilitar a autenticação em ambiente de desenvolvimento
 */

export const authConfig = {
  // Em desenvolvimento, permitir bypass da autenticação
  isAuthEnabled:
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_AUTH === "true",

  // Se auth estiver desabilitada, usar usuário mockado
  mockUser: {
    id: "dev-user-bemmecare",
    client_id: "clnt_bemmecare",
    name: "Admin BemMeCare",
    email: "admin@bemmecare.com",
    role: "ADMIN" as const,
    status: "ACTIVE" as const,
    emailVerified: true,
    lastLogin: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

/**
 * Verifica se a autenticação está habilitada
 */
export function isAuthenticationEnabled(): boolean {
  return authConfig.isAuthEnabled;
}

/**
 * Retorna usuário atual (real ou mockado)
 */
export function getCurrentUser(): User {
  const mockData = authConfig.mockUser;
  
  // Transformar para o tipo User esperado
  return {
    id: mockData.id,
    name: mockData.name,
    email: mockData.email,
    role: mockData.role,
    clientId: mockData.client_id, // Converter client_id para clientId
    client: {
      id: mockData.client_id,
      name: "BemMeCare Demo",
      status: "ACTIVE"
    }
  };
}

/**
 * Simula verificação de autenticação
 */
export function isAuthenticated(): boolean {
  if (!authConfig.isAuthEnabled) {
    return true; // Em dev, sempre autenticado
  }

  // Aqui seria a lógica real de verificação
  return false;
}

/**
 * Middleware de autenticação para desenvolvimento
 */
export function devAuthMiddleware() {
  return {
    isAuthenticated: isAuthenticated(),
    user: getCurrentUser(),
    authEnabled: authConfig.isAuthEnabled,
  };
} 