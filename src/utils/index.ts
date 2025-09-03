/**
 * Exportações centralizadas dos utilitários
 */

// Logger utilities
export { log, logError, logWarning, logInfo } from "./logger";

// Error handling utilities
export {
  handleError,
  createErrorMessage,
  safelyHandleError,
} from "./error-handler";

// Validation utilities
export {
  validateId,
  validateEmail,
  validateQuantity,
  validateAmount,
  validateNonEmptyString,
  validateBrazilianZipCode,
  validatePassword,
  validatePasswordMatch,
  validateCardNumber,
  validateCVV,
  validateCardExpiry,
} from "./validators";

// Query building utilities
export {
  buildQueryParams,
  buildUrlWithQuery,
  cleanFilters,
} from "./query-builder";

// Formatting utilities
export {
  generateSlug,
  formatZipCode,
  formatPhoneNumber,
  formatCPF,
  formatCNPJ,
  formatCurrency,
  formatDate,
  formatDateTime,
  truncateText,
  capitalize,
  capitalizeWords,
} from "./formatters";

// API utilities
export {
  createApiResponse,
  extractApiData,
  isApiSuccess,
  getApiCount,
  getApiSuccessStatus,
} from "./api-utils";
