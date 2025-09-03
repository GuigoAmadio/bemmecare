/**
 * Utilitários para extração e tratamento de mensagens de erro
 */

// Função para extrair mensagem de erro de diferentes tipos de erro
export function extractErrorMessage(error: any): string {
  // Se é uma string simples
  if (typeof error === "string") {
    return error;
  }

  // Se é um objeto Error padrão
  if (error instanceof Error) {
    return error.message;
  }

  // Se é um objeto com propriedade message
  if (error && typeof error === "object" && error.message) {
    return error.message;
  }

  // Se é um erro de resposta HTTP com dados estruturados
  if (error && typeof error === "object") {
    // Verifica se tem propriedade 'response' (axios style)
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    // Verifica se é uma estrutura de erro da API
    if (error.data?.message) {
      return error.data.message;
    }

    if (error.data?.error) {
      return error.data.error;
    }

    // Se tem propriedade 'error' diretamente
    if (error.error) {
      return typeof error.error === "string"
        ? error.error
        : error.error.message;
    }

    // Se tem propriedade 'details'
    if (error.details) {
      return Array.isArray(error.details)
        ? error.details.join(", ")
        : error.details;
    }

    // Se é um array de erros de validação
    if (Array.isArray(error) && error.length > 0) {
      return error.map((e) => extractErrorMessage(e)).join(", ");
    }
  }

  // Fallback para erro desconhecido
  return "Erro desconhecido";
}

// Função para formatar erro para exibição ao usuário
export function formatErrorForUser(error: any): string {
  const message = extractErrorMessage(error);

  // Mapear mensagens técnicas para mensagens amigáveis
  const friendlyMessages: Record<string, string> = {
    "Network Error": "Erro de conexão. Verifique sua internet.",
    "Request timeout":
      "A requisição demorou muito para responder. Tente novamente.",
    "Internal Server Error":
      "Erro interno do servidor. Tente novamente em alguns instantes.",
    "Bad Request": "Dados inválidos enviados.",
    Unauthorized: "Você não tem permissão para realizar esta ação.",
    Forbidden: "Acesso negado.",
    "Not Found": "Recurso não encontrado.",
    Conflict: "Conflito de dados. Verifique as informações.",
    "Validation Error": "Erro de validação. Verifique os dados informados.",
    "Authentication failed": "Falha na autenticação. Faça login novamente.",
    "Token expired": "Sua sessão expirou. Faça login novamente.",
  };

  // Verifica se existe uma mensagem amigável mapeada
  for (const [technical, friendly] of Object.entries(friendlyMessages)) {
    if (message.toLowerCase().includes(technical.toLowerCase())) {
      return friendly;
    }
  }

  return message;
}

// Função para verificar se é um erro de rede
export function isNetworkError(error: any): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  return (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("fetch")
  );
}

// Função para verificar se é um erro de autenticação
export function isAuthError(error: any): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  return (
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes("token") ||
    message.includes("forbidden") ||
    (error && error.status === 401) ||
    (error && error.status === 403)
  );
}

// Função para verificar se é um erro de validação
export function isValidationError(error: any): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  return (
    message.includes("validation") ||
    message.includes("invalid") ||
    message.includes("required") ||
    (error && error.status === 400) ||
    (error && error.status === 422)
  );
}

// Função para classificar o tipo de erro
export function classifyError(
  error: any
): "network" | "auth" | "validation" | "server" | "unknown" {
  if (isNetworkError(error)) return "network";
  if (isAuthError(error)) return "auth";
  if (isValidationError(error)) return "validation";

  // Verifica se é erro do servidor
  if (error && error.status >= 500) return "server";

  return "unknown";
}

// Função para obter ação recomendada baseada no tipo de erro
export function getErrorAction(error: any): string {
  const type = classifyError(error);

  const actions: Record<string, string> = {
    network: "Verifique sua conexão com a internet e tente novamente.",
    auth: "Faça login novamente para continuar.",
    validation: "Verifique os dados informados e corrija os erros.",
    server:
      "Tente novamente em alguns instantes. Se o problema persistir, entre em contato conosco.",
    unknown:
      "Tente novamente ou entre em contato com o suporte se o problema persistir.",
  };

  return actions[type];
}

// Função para criar um objeto de erro padronizado
export function createStandardError(error: any) {
  return {
    message: extractErrorMessage(error),
    userMessage: formatErrorForUser(error),
    type: classifyError(error),
    action: getErrorAction(error),
    timestamp: new Date().toISOString(),
    originalError: error,
  };
}
