/**
 * Utilitários para formatação de dados
 */

// Função para gerar slug a partir de texto
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .trim();
};

// Função para formatar CEP brasileiro
export const formatZipCode = (zipCode: string): string => {
  const clean = zipCode.replace(/\D/g, "");
  return clean.replace(/(\d{5})(\d{3})/, "$1-$2");
};

// Função para formatar número de telefone brasileiro
export const formatPhoneNumber = (phone: string): string => {
  const clean = phone.replace(/\D/g, "");

  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return phone;
};

// Função para formatar CPF
export const formatCPF = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, "");
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para formatar CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const clean = cnpj.replace(/\D/g, "");
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

// Função para formatar valor monetário em Real
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para formatar data brasileira
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
};

// Função para formatar data e hora brasileira
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Função para truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

// Função para capitalizar primeira letra
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Função para capitalizar palavras
export const capitalizeWords = (text: string): string => {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};
