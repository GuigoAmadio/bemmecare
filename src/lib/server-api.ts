import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";

// Configuração da API
const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:3000/api/v1", // Backend NestJS na porta 3000
  defaultClientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || "bemmecare", // ID específico da BemMeCare
};

// Função para obter headers em Server Actions
async function getServerHeaders(): Promise<Record<string, string>> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;
    const clientId =
      cookieStore.get("client_id")?.value || API_CONFIG.defaultClientId;

    // Logs apenas em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Debug Server Headers:", { hasToken: !!token, clientId });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "client-id": clientId,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Erro ao obter headers do servidor:", error);
    }
    return {
      "Content-Type": "application/json",
      "client-id": API_CONFIG.defaultClientId,
    };
  }
}

// Funções para Server Actions
export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getServerHeaders();

  const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  console.log("📡 [server-api] Resposta HTTP:", {
    url: `${API_CONFIG.baseURL}${url}`,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ [server-api] Erro HTTP:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(
    "📦 [server-api] Dados recebidos:",
    JSON.stringify(data, null, 2)
  );

  return {
    success: true,
    data,
    message: "Success",
  };
}

export async function serverGet<T>(url: string): Promise<ApiResponse<T>> {
  return serverFetch<T>(url);
}

export async function serverPost<T>(
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function serverPut<T>(
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function serverPatch<T>(
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function serverDelete<T>(url: string): Promise<ApiResponse<T>> {
  return serverFetch<T>(url, {
    method: "DELETE",
  });
}

// Função para verificar conectividade com o backend
export async function checkBackendConnection(): Promise<boolean> {
  try {
    await serverGet("/health");
    return true;
  } catch {
    return false;
  }
}
