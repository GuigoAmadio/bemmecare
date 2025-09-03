/**
 * Utilitários específicos para actions da API
 */

// Função para retornar resposta padrão de sucesso/erro
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  message?: string
): { success: boolean; data?: T; message?: string } => {
  return { success, data, message };
};

// Função para extrair dados da resposta da API
export const extractApiData = <T>(response: { data?: T }): T | undefined => {
  return response.data;
};

// Função para verificar se resposta foi bem-sucedida
export const isApiSuccess = (response: { success?: boolean }): boolean => {
  return response.success === true;
};

// Função para obter contagem de resposta da API
export const getApiCount = (response: { data?: { count: number } }): number => {
  return response.data?.count || 0;
};

// Função para obter status de sucesso da resposta
export const getApiSuccessStatus = (response: {
  data?: { success: boolean };
}): boolean => {
  return response.data?.success || false;
};
