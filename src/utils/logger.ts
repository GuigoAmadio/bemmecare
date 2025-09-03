/**
 * Utilitários para logging condicionado ao ambiente
 */

// Função auxiliar para logs apenas em desenvolvimento
export const log = (message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, data);
  }
};

// Função para logs de erro
export const logError = (message: string, error?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.error(message, error);
  }
};

// Função para logs de warning
export const logWarning = (message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(message, data);
  }
};

// Função para logs de informação
export const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.info(message, data);
  }
};
