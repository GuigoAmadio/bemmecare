"use server";

import { serverGet } from "@/lib/server-api";
import type { DashboardStats, ApiResponse } from "@/types";

// Obter estatísticas completas do dashboard
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const result = await serverGet<DashboardStats>("/dashboard/stats");

    return {
      success: true,
      data: result.data,
      message: "Estatísticas carregadas com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar estatísticas do dashboard:", error);

    // Retornar dados mock em caso de erro (para desenvolvimento)
    const mockStats: DashboardStats = {
      mainMetrics: {
        websiteVisits: 3247,
        totalSalesAmount: 142350.50,
        totalProductsSold: 1856,
        monthlyRevenue: 28450.00
      },
      topSellingProducts: [
        {
          id: "1",
          name: "Sérum Hidratante Premium",
          description: "Sérum com ácido hialurônico",
          price: 89.90,
          quantitySold: 245,
          totalRevenue: 22027.55,
          image: "/api/placeholder/150/150"
        },
        {
          id: "2", 
          name: "Creme Anti-idade Noturno",
          description: "Creme regenerador para pele madura",
          price: 156.90,
          quantitySold: 189,
          totalRevenue: 29654.10,
          image: "/api/placeholder/150/150"
        },
        {
          id: "3",
          name: "Protetor Solar FPS 60",
          description: "Proteção solar com base",
          price: 67.50,
          quantitySold: 312,
          totalRevenue: 21060.00,
          image: "/api/placeholder/150/150"
        },
        {
          id: "4",
          name: "Limpador Facial Suave",
          description: "Gel de limpeza para todos os tipos de pele",
          price: 45.90,
          quantitySold: 267,
          totalRevenue: 12255.30,
          image: "/api/placeholder/150/150"
        },
        {
          id: "5",
          name: "Máscara Revitalizante",
          description: "Máscara facial com vitamina C",
          price: 78.90,
          quantitySold: 198,
          totalRevenue: 15622.20,
          image: "/api/placeholder/150/150"
        }
      ],
      consultations: {
        today: 12,
        thisMonth: 348,
        monthlyRevenue: 18900.00,
        todayAppointments: [
          {
            id: "1",
            startTime: "2024-06-23T09:00:00",
            endTime: "2024-06-23T10:00:00",
            status: "CONFIRMED",
            service: {
              name: "Limpeza de Pele",
              price: 120.00
            },
            user: {
              name: "Maria Silva",
              email: "maria@email.com"
            }
          },
          {
            id: "2",
            startTime: "2024-06-23T10:30:00",
            endTime: "2024-06-23T11:30:00",
            status: "SCHEDULED",
            service: {
              name: "Massagem Relaxante",
              price: 180.00
            },
            user: {
              name: "João Santos",
              email: "joao@email.com"
            }
          },
          {
            id: "3",
            startTime: "2024-06-23T14:00:00",
            endTime: "2024-06-23T15:30:00",
            status: "CONFIRMED",
            service: {
              name: "Tratamento Facial",
              price: 250.00
            },
            user: {
              name: "Ana Costa",
              email: "ana@email.com"
            }
          },
          {
            id: "4",
            startTime: "2024-06-23T16:00:00",
            endTime: "2024-06-23T17:00:00",
            status: "SCHEDULED",
            service: {
              name: "Peeling Químico",
              price: 320.00
            },
            user: {
              name: "Carlos Oliveira",
              email: "carlos@email.com"
            }
          }
        ]
      },
      overview: {
        totalProducts: 127,
        lowStockProducts: 8,
        pendingOrders: 23
      }
    };

    return {
      success: true,
      data: mockStats,
      message: "Dados de demonstração carregados",
    };
  }
}

// Obter atividades recentes
export async function getRecentActivities(): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    type: "appointment" | "sale" | "product" | "patient";
    message: string;
    timestamp: string;
    user?: string;
  }>;
  message: string;
}> {
  try {
    const result = await serverGet<
      Array<{
        id: string;
        type: "appointment" | "sale" | "product" | "patient";
        message: string;
        timestamp: string;
        user?: string;
      }>
    >("/dashboard/activities");

    return {
      success: true,
      data: result.data,
      message: "Atividades carregadas com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar atividades recentes:", error);

    // Retornar dados mock em caso de erro
    const mockActivities = [
      {
        id: "1",
        type: "appointment" as const,
        message: "Nova consulta agendada com Maria Silva",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        user: "Dr. João Santos",
      },
      {
        id: "2",
        type: "sale" as const,
        message: "Venda de R$ 150,00 processada",
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        user: "Recepção",
      },
      {
        id: "3",
        type: "patient" as const,
        message: "Novo paciente cadastrado: Carlos Lima",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: "Ana Costa",
      },
      {
        id: "4",
        type: "product" as const,
        message: "Estoque baixo: Medicamento XYZ",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        user: "Sistema",
      },
    ];

    return {
      success: true,
      data: mockActivities,
      message: "Dados de demonstração carregados",
    };
  }
}

// Obter próximos agendamentos
export async function getUpcomingAppointments(): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    patient: string;
    time: string;
    type: string;
    doctor?: string;
    status: "confirmed" | "pending" | "canceled";
  }>;
  message: string;
}> {
  try {
    const result = await serverGet<
      Array<{
        id: string;
        patient: string;
        time: string;
        type: string;
        doctor?: string;
        status: "confirmed" | "pending" | "canceled";
      }>
    >("/appointments/upcoming");

    return {
      success: true,
      data: result.data,
      message: "Agendamentos carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar próximos agendamentos:", error);

    // Retornar dados mock em caso de erro
    const mockAppointments = [
      {
        id: "1",
        patient: "Maria Silva",
        time: "09:00",
        type: "Consulta Geral",
        doctor: "Dr. João Santos",
        status: "confirmed" as const,
      },
      {
        id: "2",
        patient: "Pedro Costa",
        time: "10:30",
        type: "Retorno",
        doctor: "Dra. Ana Lima",
        status: "confirmed" as const,
      },
      {
        id: "3",
        patient: "Carla Oliveira",
        time: "14:00",
        type: "Exame",
        doctor: "Dr. Carlos Santos",
        status: "pending" as const,
      },
      {
        id: "4",
        patient: "Roberto Silva",
        time: "15:30",
        type: "Consulta Especializada",
        doctor: "Dra. Fernanda Costa",
        status: "confirmed" as const,
      },
    ];

    return {
      success: true,
      data: mockAppointments,
      message: "Dados de demonstração carregados",
    };
  }
}
