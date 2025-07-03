"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginInput, User } from "@/types";
import { serverPost, serverGet } from "@/lib/server-api";

// Interfaces para tipar os dados da API
interface LoginApiResponse {
  data?: {
    token: string;
    client_id: string;
    refresh_token?: string;
    user: User;
  };
  token?: string;
  client_id?: string;
  refresh_token?: string;
  user?: User;
}

interface AuthMeResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  client_id?: string;
  clientId?: string;
  client?: {
    id: string;
    name: string;
    status: string;
  };
}

// Login do usuário
export async function loginAction(data: LoginInput) {
  try {
    console.log("🔐 BemMeCare - Iniciando login...");
    console.log("📧 Email:", data.email);

    const result = await serverPost<LoginApiResponse>("/auth/login", data);
    console.log("📋 result.data:", JSON.stringify(result.data, null, 2));

    // A API retorna uma estrutura aninhada: result.data.data contém os dados reais
    const nestedResult = result.data as LoginApiResponse;
    const responseData = nestedResult?.data || result.data || result;

    console.log("✅ BemMeCare - Login bem-sucedido!");
    console.log("- Token recebido:", !!(responseData as any)?.token);
    console.log("- Client ID recebido:", (responseData as any)?.client_id);
    console.log(
      "- Refresh token recebido:",
      !!(responseData as any)?.refresh_token
    );
    console.log("- User recebido:", !!(responseData as any)?.user);

    // Verificar se temos os dados necessários
    if (!(responseData as any)?.token) {
      console.error("❌ Token não encontrado na resposta!");
      console.error("📋 Dados encontrados:", Object.keys(responseData || {}));
      return {
        success: false,
        message: "Token não recebido do servidor",
      };
    }

    if (!(responseData as any)?.client_id) {
      console.error("❌ Client ID não encontrado na resposta!");
      console.error("📋 Dados encontrados:", Object.keys(responseData || {}));
      return {
        success: false,
        message: "Client ID não recebido do servidor",
      };
    }

    // Salvar tokens e client_id nos cookies httpOnly
    const cookieStore = await cookies();

    cookieStore.set("auth_token", (responseData as any).token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    // Salvar client_id do usuário autenticado
    cookieStore.set("client_id", (responseData as any).client_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    // Salvar refresh token se fornecido
    if ((responseData as any).refresh_token) {
      cookieStore.set("refresh_token", (responseData as any).refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    console.log("🍪 BemMeCare - Cookies salvos com sucesso!");
    console.log(
      "- auth_token:",
      cookieStore.get("auth_token") ? "Salvo" : "ERRO"
    );
    console.log("- client_id:", cookieStore.get("client_id")?.value);
    console.log(
      "- refresh_token:",
      cookieStore.get("refresh_token") ? "Salvo" : "N/A"
    );

    return {
      success: true,
      message: "Login realizado com sucesso",
      user: (responseData as any).user,
      clientId: (responseData as any).client_id,
    };
  } catch (error: unknown) {
    console.error("❌ BemMeCare - Erro no login:", error);
    console.error("❌ Erro completo:", JSON.stringify(error, null, 2));
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno do servidor";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Logout do usuário
export async function logoutAction() {
  try {
    const cookieStore = await cookies();

    // Tentar fazer logout no backend
    try {
      await serverPost("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout no backend:", error);
      // Continuar com logout local mesmo se der erro no backend
    }

    // Limpar todos os cookies
    cookieStore.delete("auth_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("client_id");

    redirect("/login");
  } catch (error) {
    console.error("Erro no logout:", error);
    redirect("/login");
  }
}

// Verificar se o usuário está autenticado
export async function getAuthUser(): Promise<User | null> {
  try {
    const result = await serverGet<AuthMeResponse>("/auth/me");

    // Verificar wrapper duplo
    const userData = (result.data as any)?.data || result.data;

    if (!userData) {
      return null;
    }

    // Transformar client_id em clientId para compatibilidade
    const user: User = {
      ...userData,
      clientId: userData.client_id || userData.clientId || "",
    };

    return user;
  } catch (error: unknown) {
    console.error("Erro ao verificar autenticação:", error);

    // NÃO deletar cookies aqui - apenas retornar null
    // A limpeza deve ser feita em uma Server Action separada
    return null;
  }
}

// Middleware para verificar autenticação
export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// Obter informações do tenant/cliente atual
export async function getCurrentClient() {
  const cookieStore = await cookies();
  return {
    clientId: cookieStore.get("client_id")?.value || null,
    token: cookieStore.get("auth_token")?.value || null,
  };
}

// Refresh do token (para uso em caso de erro 401)
export async function refreshTokenAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      throw new Error("Refresh token não encontrado");
    }

    const result = await serverPost<{ token: string; refresh_token: string }>(
      "/auth/refresh",
      {
        refresh_token: refreshToken,
      }
    );

    // Verificar wrapper duplo
    const tokenData = (result.data as any)?.data || result.data;

    if (!tokenData) {
      throw new Error("Dados não recebidos do servidor");
    }

    // Atualizar cookies com novos tokens
    cookieStore.set("auth_token", tokenData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    cookieStore.set("refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return {
      success: true,
      message: "Token renovado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao renovar token:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao renovar token";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Limpar cookies de autenticação
export async function clearAuthCookiesAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("client_id");
}
