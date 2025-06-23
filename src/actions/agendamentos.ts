"use server";

import {
  serverGet,
  serverPost,
  serverPut,
  serverDelete,
} from "@/lib/server-api";
import type {
  Appointment,
  AppointmentStats,
  AppointmentFilters,
  PaginationParams,
  CreateAppointmentData,
  UpdateAppointmentData,
  ApiResponse,
  PaginatedResponse,
  Category,
  AvailableSlot,
} from "@/types";

// Obter agendamentos para o calendário
export async function getCalendarAppointments(
  startDate?: string,
  endDate?: string,
  categoryId?: string
): Promise<ApiResponse<Appointment[]>> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (categoryId) params.append("categoryId", categoryId);

    const result = await serverGet<Appointment[]>(
      `/appointments/calendar?${params.toString()}`
    );
    return {
      success: true,
      data: result.data || [],
      message: "Agendamentos do calendário carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar agendamentos do calendário:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter agendamentos da semana
export async function getWeekAppointments(
  date?: string
): Promise<ApiResponse<Appointment[]>> {
  try {
    const params = date ? `?date=${date}` : "";
    const result = await serverGet<Appointment[]>(
      `/appointments/week${params}`
    );
    return {
      success: true,
      data: result.data || [],
      message: "Agendamentos da semana carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar agendamentos da semana:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter agendamentos de hoje
export async function getTodayAppointments(): Promise<
  ApiResponse<{
    appointments: Appointment[];
    totalToday: number;
    revenue: number;
  }>
> {
  try {
    const result = await serverGet<{
      appointments: Appointment[];
      totalToday: number;
      revenue: number;
    }>("/appointments/today");
    return {
      success: true,
      data: result.data,
      message: "Agendamentos de hoje carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar agendamentos de hoje:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter estatísticas de agendamentos
export async function getAppointmentStats(): Promise<
  ApiResponse<AppointmentStats>
> {
  try {
    const result = await serverGet<AppointmentStats>("/appointments/stats");
    return {
      success: true,
      data: result.data,
      message: "Estatísticas de agendamentos carregadas com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar estatísticas de agendamentos:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter categorias de agendamentos
export async function getAppointmentCategories(): Promise<
  ApiResponse<Category[]>
> {
  try {
    const result = await serverGet<Category[]>("/appointments/categories");
    return {
      success: true,
      data: result.data || [],
      message: "Categorias carregadas com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar categorias:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Criar categoria de agendamento
export async function createAppointmentCategory(data: {
  name: string;
  color?: string;
  description?: string;
}): Promise<ApiResponse<Category>> {
  try {
    const result = await serverPost<Category>("/appointments/categories", data);
    return {
      success: true,
      data: result.data,
      message: "Categoria criada com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao criar categoria:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao criar categoria",
    };
  }
}

// Obter horários disponíveis
export async function getAvailableSlots(
  date: string,
  duration: number = 60
): Promise<ApiResponse<AvailableSlot[]>> {
  try {
    const result = await serverGet<AvailableSlot[]>(
      `/appointments/available-slots?date=${date}&duration=${duration}`
    );
    return {
      success: true,
      data: result.data || [],
      message: "Horários disponíveis carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar horários disponíveis:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Listar agendamentos com filtros e paginação
export async function getAppointments(
  pagination: PaginationParams = { page: 1, limit: 10 },
  filters: AppointmentFilters = {}
): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
  try {
    const params = new URLSearchParams();

    // Adicionar parâmetros de paginação
    if (pagination.page) params.append("page", pagination.page.toString());
    if (pagination.limit) params.append("limit", pagination.limit.toString());

    // Adicionar filtros
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);

    const result = await serverGet<PaginatedResponse<Appointment>>(
      `/appointments?${params.toString()}`
    );
    return {
      success: true,
      data: result.data,
      message: "Agendamentos carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar agendamentos:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter agendamento por ID
export async function getAppointment(
  id: string
): Promise<ApiResponse<Appointment>> {
  try {
    const result = await serverGet<Appointment>(`/appointments/${id}`);
    return {
      success: true,
      data: result.data,
      message: "Agendamento carregado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar agendamento:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Agendamento não encontrado",
    };
  }
}

// Criar agendamento
export async function createAppointment(
  data: CreateAppointmentData
): Promise<ApiResponse<Appointment>> {
  try {
    const result = await serverPost<Appointment>("/appointments", data);
    return {
      success: true,
      data: result.data,
      message: "Agendamento criado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao criar agendamento:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao criar agendamento",
    };
  }
}

// Atualizar agendamento
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
): Promise<ApiResponse<Appointment>> {
  try {
    const result = await serverPut<Appointment>(`/appointments/${id}`, data);
    return {
      success: true,
      data: result.data,
      message: "Agendamento atualizado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar agendamento:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar agendamento",
    };
  }
}

// Deletar agendamento
export async function deleteAppointment(
  id: string
): Promise<ApiResponse<null>> {
  try {
    await serverDelete(`/appointments/${id}`);
    return {
      success: true,
      data: null,
      message: "Agendamento deletado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao deletar agendamento:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao deletar agendamento",
    };
  }
}

// Atualizar status do agendamento
export async function updateAppointmentStatus(
  id: string,
  status: string
): Promise<ApiResponse<Appointment>> {
  try {
    const result = await serverPut<Appointment>(`/appointments/${id}/status`, {
      status,
    });
    return {
      success: true,
      data: result.data,
      message: "Status atualizado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar status:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar status",
    };
  }
}

// Criar múltiplos agendamentos
export async function createBulkAppointments(
  appointments: CreateAppointmentData[]
): Promise<
  ApiResponse<{
    created: Appointment[];
    errors: { data: CreateAppointmentData; error: string }[];
    summary: { total: number; created: number; failed: number };
  }>
> {
  try {
    const result = await serverPost<{
      created: Appointment[];
      errors: { data: CreateAppointmentData; error: string }[];
      summary: { total: number; created: number; failed: number };
    }>("/appointments/bulk", appointments);

    return {
      success: true,
      data: result.data,
      message: "Agendamentos processados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao criar agendamentos em lote:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao criar agendamentos",
    };
  }
}
