"use server";

import { log, handleError } from "@/utils";
import { serverGet } from "@/lib/server-api";

/**
 * Sistema de prefetch para otimização de carregamento de dados
 * Carrega dados antecipadamente para melhorar a experiência do usuário
 */

// Prefetch para estatísticas do dashboard
export async function prefetchDashboardStats(): Promise<any> {
  try {
    const response = await serverGet<any>("/dashboard/stats");
    log("[prefetchDashboardStats] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchDashboardStats", error);
  }
}

// Prefetch para perfil do usuário atual
export async function prefetchCurrentProfile(): Promise<any> {
  try {
    const response = await serverGet<any>("/users/me");
    log("[prefetchCurrentProfile] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchCurrentProfile", error);
  }
}

// Prefetch para agendamentos de hoje
export async function prefetchTodayAppointments(): Promise<any> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await serverGet<any>(`/appointments?date=${today}`);
    log("[prefetchTodayAppointments] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchTodayAppointments", error);
  }
}

// Prefetch para meus agendamentos
export async function prefetchMyAppointments(): Promise<any> {
  try {
    const response = await serverGet<any>("/appointments/mine");
    log("[prefetchMyAppointments] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchMyAppointments", error);
  }
}

// Prefetch para funcionários
export async function prefetchEmployees(): Promise<any> {
  try {
    const response = await serverGet<any>("/employees");
    log("[prefetchEmployees] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchEmployees", error);
  }
}

// Prefetch para serviços disponíveis
export async function prefetchAvailableServices(): Promise<any> {
  try {
    const response = await serverGet<any>("/services/available");
    log("[prefetchAvailableServices] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchAvailableServices", error);
  }
}

// Prefetch para todos os serviços
export async function prefetchAllServices(): Promise<any> {
  try {
    const response = await serverGet<any>("/services");
    log("[prefetchAllServices] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchAllServices", error);
  }
}

// Prefetch para produtos em destaque
export async function prefetchFeaturedProducts(): Promise<any> {
  try {
    const response = await serverGet<any>("/products/featured");
    log("[prefetchFeaturedProducts] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchFeaturedProducts", error);
  }
}

// Prefetch para categorias populares
export async function prefetchPopularCategories(): Promise<any> {
  try {
    const response = await serverGet<any>("/categories/popular");
    log("[prefetchPopularCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchPopularCategories", error);
  }
}

// Prefetch para pedidos recentes
export async function prefetchRecentOrders(): Promise<any> {
  try {
    const response = await serverGet<any>("/orders/recent");
    log("[prefetchRecentOrders] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchRecentOrders", error);
  }
}

// Prefetch para notificações do usuário
export async function prefetchUserNotifications(): Promise<any> {
  try {
    const response = await serverGet<any>("/notifications");
    log("[prefetchUserNotifications] Response:", response);
    return response.data;
  } catch (error) {
    handleError("prefetchUserNotifications", error);
  }
}

// Prefetch personalizado genérico
export async function prefetchData(
  endpoint: string,
  params?: Record<string, any>
): Promise<any> {
  try {
    const queryParams = params ? new URLSearchParams(params).toString() : "";
    const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;

    const response = await serverGet<any>(url);
    log(`[prefetchData] ${endpoint} Response:`, response);
    return response.data;
  } catch (error) {
    handleError(`prefetchData-${endpoint}`, error);
  }
}
