import type { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_CLIENT_ID = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || "";

async function getHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-client-id": DEFAULT_CLIENT_ID,
  };

  let token: string | undefined;

  try {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const authCookie = cookieStore.get("auth_token");
      token = authCookie?.value;
    } else {
      console.log(
        "❌ [server-api] Executando no cliente - não é possível acessar cookies HTTP-only"
      );
      token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
    }
  } catch (error) {
    console.error("❌ [server-api] Erro geral ao acessar cookies:", error);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("✅ [server-api] Authorization header adicionado");
  } else {
    console.log(
      "❌ [server-api] Nenhum token disponível - requisição sem autenticação"
    );
  }

  return headers;
}

// Funções para Server Actions
export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getHeaders();

  if (process.env.NODE_ENV === "development") {
    console.log("[server-api] Fazendo fetch:", {
      url: `${API_URL}${url}`,
      headers: { ...headers, ...(options.headers || {}) },
      method: options.method || "GET",
    });
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log("📡 [server-api] Resposta HTTP:", {
      url: `${API_URL}${url}`,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    if (process.env.NODE_ENV === "development") {
      console.error("❌ [server-api] Erro HTTP:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
    }
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (process.env.NODE_ENV === "development") {
    console.log("📦 [server-api] Dados recebidos:", data);
  }

  return data;
}

// Funções para Server Actions
export async function serverGet<T>(url: string): Promise<ApiResponse<T>> {
  return await serverFetch<T>(url);
}

export async function serverPost<T>(
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return await serverFetch<T>(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function serverPut<T>(
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return await serverFetch<T>(url, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function serverPatch<T>(
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return await serverFetch<T>(url, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function serverDelete<T>(url: string): Promise<ApiResponse<T>> {
  return await serverFetch<T>(url, { method: "DELETE" });
}
