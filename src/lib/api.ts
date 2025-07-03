import axios, { AxiosResponse } from "axios";
import type { ApiResponse, ApiError } from "@/types";

// Configuração da API otimizada para BemMeCare
const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:3000/api/v1", // Backend NestJS na porta 3000
  timeout: 5000,
  defaultClientId:
    process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID ||
    "0ac8fc12-06c8-427e-acc4-663ee5245360",
};

// Cache simples para requisições
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 segundos

// Tipos para configuração de tenant/cliente
interface TenantConfig {
  clientId: string;
  token?: string;
}

// Armazenamento do tenant atual (client-side)
let currentTenant: TenantConfig | null = null;

// Flag para evitar redirecionamentos múltiplos
let isRedirecting = false;

// Função para definir o tenant atual
export function setCurrentTenant(clientId: string, token?: string) {
  currentTenant = { clientId, token };

  // Salvar no localStorage se estiver no browser
  if (typeof window !== "undefined") {
    localStorage.setItem("current_client_id", clientId);
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  }
}

// Função para obter o tenant atual
export function getCurrentTenant(): TenantConfig | null {
  if (currentTenant) {
    return currentTenant;
  }

  // Tentar recuperar do localStorage
  if (typeof window !== "undefined") {
    const clientId = localStorage.getItem("current_client_id");
    const token = localStorage.getItem("auth_token");

    if (clientId) {
      currentTenant = { clientId, token: token || undefined };
      return currentTenant;
    }
  }

  return null;
}

// Função para obter headers padrão (client-side)
function getDefaultHeaders(config?: {
  clientId?: string;
  token?: string;
}): Record<string, string> {
  const tenant = getCurrentTenant();
  const clientId =
    config?.clientId || tenant?.clientId || API_CONFIG.defaultClientId;
  const token = config?.token || tenant?.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": clientId,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Instância do axios configurada
export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    const defaultHeaders = getDefaultHeaders();
    Object.assign(config.headers, defaultHeaders);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para respostas com tratamento de erro melhorado
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    console.log("🔍 API Error:", error.response?.status, error.response?.data);

    // Tratamento de erro 401 - Token expirado ou inválido
    if (error.response?.status === 401) {
      console.log("🚨 Token inválido/expirado - limpando autenticação");

      // Limpar autenticação local
      clearAuth();

      // Evitar redirecionamentos múltiplos
      if (!isRedirecting && typeof window !== "undefined") {
        isRedirecting = true;

        // Só redirecionar se não estamos já na página de login
        if (!window.location.pathname.includes("/login")) {
          console.log("🔄 Redirecionando para login devido a 401");
          window.location.href = "/login";
        }

        // Reset flag após um tempo
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || "Erro interno do servidor",
      code: error.response?.status?.toString() || "UNKNOWN_ERROR",
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

// Função para verificar cache
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

// Função para definir cache
function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Funções de API otimizadas com cache (CLIENT-SIDE)
export async function get<T>(
  url: string,
  config?: { clientId?: string; token?: string; useCache?: boolean }
): Promise<ApiResponse<T>> {
  const cacheKey = `GET:${url}:${JSON.stringify(config)}`;

  // Verificar cache se habilitado
  if (config?.useCache !== false) {
    const cached = getCachedData<ApiResponse<T>>(cacheKey);
    if (cached) return cached;
  }

  const data = (await api.get<T>(url, {
    headers: getDefaultHeaders(config),
  })) as T;

  const response: ApiResponse<T> = {
    success: true,
    data,
    message: "Success",
  };

  // Salvar no cache
  if (config?.useCache !== false) {
    setCachedData(cacheKey, response);
  }

  return response;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const result = (await api.post<T>(url, data, {
    headers: getDefaultHeaders(config),
  })) as T;

  return {
    success: true,
    data: result,
    message: "Success",
  };
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const result = (await api.put<T>(url, data, {
    headers: getDefaultHeaders(config),
  })) as T;

  return {
    success: true,
    data: result,
    message: "Success",
  };
}

export async function del<T>(
  url: string,
  config?: { clientId?: string; token?: string }
): Promise<ApiResponse<T>> {
  const result = (await api.delete<T>(url, {
    headers: getDefaultHeaders(config),
  })) as T;

  return {
    success: true,
    data: result,
    message: "Success",
  };
}

// Função para limpar cache
export function clearCache(): void {
  cache.clear();
}

// Função para limpar autenticação melhorada
export function clearAuth() {
  console.log("🧹 Limpando autenticação local");
  currentTenant = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_client_id");
  }
  clearCache(); // Limpar cache também
}
