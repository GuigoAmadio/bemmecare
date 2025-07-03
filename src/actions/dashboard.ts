"use server";

import { serverGet } from "@/lib/server-api";
import type { DashboardStats } from "@/types";

interface ProductStatsResponse {
  totalProducts: number;
  totalSoldValue: number;
  totalSoldQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  averagePrice: number;
  monthlyRevenue: number;
}

interface AppointmentStatsResponse {
  today: {
    count: number;
    revenue: number;
  };
  month: {
    count: number;
    revenue: number;
  };
  overall: {
    totalCompleted: number;
    averageDuration: number;
  };
}

interface TopSellingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantitySold: number;
  totalRevenue: number;
}

interface TodayAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    name: string;
    price: number;
  };
  user: {
    name: string;
    email: string;
  };
}

export async function getDashboardStats() {
  try {
    console.log("🚀 [Frontend] Iniciando getDashboardStats()");

    // Usar o endpoint unificado do dashboard
    const dashboardResult = await serverGet<DashboardStats>("/dashboard/stats");

    console.log("📥 [Frontend] Resposta recebida do backend:");
    console.log("Dashboard data:", dashboardResult);

    // serverGet retorna com wrapper duplo, então pegamos os dados reais
    return {
      success: true,
      data: (dashboardResult.data as any)?.data, // ← Acessa os dados reais (segundo nível)
    };
  } catch (error: any) {
    console.error("❌ [Frontend] Erro ao carregar estatísticas:", error);
    return {
      success: false,
      message: error.message || "Erro ao carregar estatísticas do dashboard",
      data: undefined,
    };
  }
}

export async function getProductStats() {
  try {
    const result = await serverGet<ProductStatsResponse>("/products/stats");
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar estatísticas de produtos",
    };
  }
}

export async function getTopSellingProducts(limit: number = 5) {
  try {
    const result = await serverGet<TopSellingProduct[]>(
      `/products/top-selling?limit=${limit}`
    );
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar produtos mais vendidos",
    };
  }
}

export async function getAppointmentStats() {
  try {
    const result = await serverGet<AppointmentStatsResponse>(
      "/appointments/stats"
    );
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar estatísticas de agendamentos",
    };
  }
}

export async function getTodayAppointments() {
  try {
    const result = await serverGet<TodayAppointment[]>("/appointments/today");
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar agendamentos de hoje",
    };
  }
}
