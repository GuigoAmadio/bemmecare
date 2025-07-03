"use server";

import { serverGet } from "@/lib/server-api";

// Fun��o para buscar informa��es gerais do tenant/cliente
export async function getTenantInfo() {
  try {
    const result = await serverGet("/auth/me");
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar informa��es do tenant",
    };
  }
}

// Fun��o para buscar estat�sticas gerais (usada em m�ltiplas p�ginas)
export async function getGeneralStats() {
  try {
    const [productsStats, appointmentsStats] = await Promise.all([
      serverGet("/products/stats"),
      serverGet("/appointments/stats"),
    ]);

    return {
      success: true,
      data: {
        products: (productsStats.data as any)?.data || productsStats.data,
        appointments:
          (appointmentsStats.data as any)?.data || appointmentsStats.data,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar estat�sticas gerais",
    };
  }
}

// Fun��o para formatar moeda brasileira (usada em v�rias p�ginas)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Fun��o para formatar data brasileira (usada em v�rias p�ginas)
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
}

// Fun��o para formatar data e hora brasileira
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

// Fun��o para gerar cores aleat�rias para categorias
export function generateRandomColor(): string {
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
    "#6366F1",
    "#84CC16",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Fun��o para validar email (usada em formul�rios)
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fun��o para validar telefone brasileiro
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Fun��o para debounce (usada em campos de busca)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Constantes comuns
export const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-gray-100 text-gray-800",
} as const;

export const APPOINTMENT_STATUS_COLORS = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-yellow-100 text-yellow-800",
} as const;

export const ORDER_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;
