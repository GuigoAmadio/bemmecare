/**
 * Utilitários para construção de query parameters
 */

// Função para construir query parameters de forma padronizada
export const buildQueryParams = (filters: Record<string, any>): URLSearchParams => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v.toString()));
      } else {
        queryParams.set(key, value.toString());
      }
    }
  });
  
  return queryParams;
};

// Função para construir URL com query parameters
export const buildUrlWithQuery = (baseUrl: string, filters: Record<string, any>): string => {
  const queryParams = buildQueryParams(filters);
  const queryString = queryParams.toString();
  
  if (!queryString) {
    return baseUrl;
  }
  
  return `${baseUrl}?${queryString}`;
};

// Função para limpar filtros vazios
export const cleanFilters = (filters: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value) && value.length > 0) {
        cleaned[key] = value;
      } else if (!Array.isArray(value)) {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};
