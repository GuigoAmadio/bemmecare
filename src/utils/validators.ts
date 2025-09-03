/**
 * Utilitários para validação de dados
 */

// Função auxiliar para validação de ID
export const validateId = (id: string, fieldName: string = "ID") => {
  if (!id?.trim()) {
    throw new Error(`${fieldName} é obrigatório`);
  }
};

// Função auxiliar para validação de email
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim()) {
    throw new Error("Email é obrigatório");
  }
  if (!emailRegex.test(email)) {
    throw new Error("Email deve ter um formato válido");
  }
};

// Função para validar quantidade
export const validateQuantity = (quantity: number, max: number = 99) => {
  if (!quantity || quantity <= 0) {
    throw new Error("Quantidade deve ser maior que zero");
  }

  if (quantity > max) {
    throw new Error(`Quantidade máxima é ${max}`);
  }
};

// Função para validar valor monetário
export const validateAmount = (amount: number, fieldName: string = "Valor") => {
  if (!amount || amount <= 0) {
    throw new Error(`${fieldName} deve ser maior que zero`);
  }
};

// Função para validar string não vazia
export const validateNonEmptyString = (value: string, fieldName: string) => {
  if (!value?.trim()) {
    throw new Error(`${fieldName} é obrigatório`);
  }
};

// Função para validar CEP brasileiro
export const validateBrazilianZipCode = (zipCode: string) => {
  if (!zipCode?.trim()) {
    throw new Error("CEP é obrigatório");
  }

  const cleanZipCode = zipCode.replace(/\D/g, "");
  if (cleanZipCode.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos");
  }

  return cleanZipCode;
};

// Função para validar senha
export const validatePassword = (password: string, minLength: number = 6) => {
  if (!password || password.length < minLength) {
    throw new Error(`Senha deve ter pelo menos ${minLength} caracteres`);
  }
};

// Função para validar se duas senhas coincidem
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    throw new Error("Senhas não coincidem");
  }
};

// Função para validar número de cartão de crédito
export const validateCardNumber = (cardNumber: string) => {
  if (!cardNumber?.trim()) {
    throw new Error("Número do cartão é obrigatório");
  }

  const cleanNumber = cardNumber.replace(/\s/g, "");

  if (!/^\d+$/.test(cleanNumber)) {
    throw new Error("Número do cartão deve conter apenas dígitos");
  }

  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    throw new Error("Número do cartão deve ter entre 13 e 19 dígitos");
  }

  return cleanNumber;
};

// Função para validar CVV
export const validateCVV = (cvv: string) => {
  if (!cvv || cvv.length < 3 || cvv.length > 4) {
    throw new Error("CVV deve ter 3 ou 4 dígitos");
  }

  if (!/^\d+$/.test(cvv)) {
    throw new Error("CVV deve conter apenas números");
  }
};

// Função para validar data de expiração do cartão
export const validateCardExpiry = (month: number, year: number) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (!month || month < 1 || month > 12) {
    throw new Error("Mês de expiração inválido");
  }

  if (!year || year < currentYear) {
    throw new Error("Ano de expiração inválido");
  }

  if (year === currentYear && month < currentMonth) {
    throw new Error("Cartão expirado");
  }
};
