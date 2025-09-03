import { log } from "./logger";

/**
 * Utilitários para tratamento de erros padronizado
 */

// Função auxiliar para tratamento de erro padronizado
export const handleError = (action: string, error: any) => {
  log(`[${action}] Erro:`, error);
  throw error;
};

// Função para criar mensagens de erro padronizadas
export const createErrorMessage = (field: string, type: "required" | "invalid" | "min" | "max", value?: any) => {
  const messages = {
    required: `${field} é obrigatório`,
    invalid: `${field} é inválido`,
    min: `${field} deve ser maior que ${value}`,
    max: `${field} deve ser menor que ${value}`,
  };
  
  return messages[type];
};

// Função para capturar e logar erros sem interromper a execução
export const safelyHandleError = (action: string, error: any, defaultReturn?: any) => {
  log(`[${action}] Erro capturado:`, error);
  return defaultReturn;
};
