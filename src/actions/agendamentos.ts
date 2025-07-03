"use server";

import {
  serverGet,
  serverPost,
  serverPut,
  serverDelete,
} from "@/lib/server-api";
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStats,
  AvailableSlot,
  PaginatedResponse,
} from "@/types";

interface CreateAppointmentData {
  title?: string;
  startTime: string;
  endTime: string;
  serviceId: string;
  userId: string;
  description?: string;
}

interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  status?: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
}

interface AppointmentFiltersExtended extends AppointmentFilters {
  page?: number;
  limit?: number;
}

// CRUD Operations
export async function getAppointments(filters?: AppointmentFiltersExtended) {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());

    const url = `/appointments${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet<PaginatedResponse<Appointment>>(url);

    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar agendamentos",
    };
  }
}

export async function getAppointment(id: string) {
  try {
    const result = await serverGet<Appointment>(`/appointments/${id}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar agendamento",
    };
  }
}

export async function createAppointment(data: CreateAppointmentData) {
  try {
    const result = await serverPost<Appointment>("/appointments", data);
    return {
      success: true,
      data: result.data,
      message: "Agendamento criado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar agendamento",
    };
  }
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
) {
  try {
    const result = await serverPut<Appointment>(`/appointments/${id}`, data);
    return {
      success: true,
      data: result.data,
      message: "Agendamento atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar agendamento",
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await serverDelete(`/appointments/${id}`);
    return {
      success: true,
      message: "Agendamento excluído com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao excluir agendamento",
    };
  }
}

export async function getTodayAppointments() {
  try {
    const result = await serverGet<Appointment[]>("/appointments/today");
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

export async function getAppointmentStats() {
  try {
    const result = await serverGet<AppointmentStats>("/appointments/stats");
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

export async function updateAppointmentStatus(
  id: string,
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
) {
  try {
    const result = await serverPut<Appointment>(`/appointments/${id}/status`, {
      status,
    });
    return {
      success: true,
      data: result.data,
      message: "Status do agendamento atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar status do agendamento",
    };
  }
}

export async function getWeekAppointments(date?: string) {
  try {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append("date", date);

    const url = `/appointments/week${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet<Appointment[]>(url);
    return {
      success: true,
      data: (result.data as any)?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar agendamentos da semana",
    };
  }
}

export async function getCalendarAppointments(
  startDate?: string,
  endDate?: string,
  categoryId?: string
) {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (categoryId) queryParams.append("categoryId", categoryId);

    const url = `/appointments/calendar${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet<Appointment[]>(url);

    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar calendário",
    };
  }
}

export async function getAvailableSlots(date: string, duration: number = 60) {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("date", date);
    queryParams.append("duration", duration.toString());

    const url = `/appointments/available-slots?${queryParams.toString()}`;
    const result = await serverGet<AvailableSlot[]>(url);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar horários disponíveis",
    };
  }
}

export async function createBulkAppointments(
  appointments: CreateAppointmentData[]
) {
  try {
    const result = await serverPost<Appointment[]>(
      "/appointments/bulk",
      appointments
    );
    return {
      success: true,
      data: result.data,
      message: "Agendamentos criados em lote com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar agendamentos em lote",
    };
  }
}
