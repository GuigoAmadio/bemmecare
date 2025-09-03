"use server";

import {
  serverGet,
  serverPost,
  serverPatch,
  serverDelete,
} from "@/lib/server-api";
import {
  Schedule,
  CreateScheduleInput,
  UpdateScheduleInput,
  GetSchedulesFilters,
  ScheduleResponse,
  SchedulesListResponse,
  ScheduleStatsResponse,
  ScheduleStatus,
} from "@/types/schedule";
import {
  log,
  handleError,
  validateId,
  buildQueryParams,
  getApiCount,
  getApiSuccessStatus,
} from "@/utils";
import { cacheHelpers } from "@/lib/cache-utils";

// ========================
// READ OPERATIONS
// ========================

/**
 * Buscar todos os schedules com filtros opcionais
 */
export async function getSchedules(
  filters?: GetSchedulesFilters
): Promise<Schedule[] | undefined> {
  try {
    const cacheKey = filters ? `filtered-${JSON.stringify(filters)}` : "all";
    const cached = cacheHelpers.schedules?.get(cacheKey) as Schedule[] | null;

    if (cached) {
      log("[getSchedules] Cache hit");
      return cached;
    }

    const queryParams = filters ? buildQueryParams(filters) : "";
    const url = `/schedule${queryParams}`;

    const response = await serverGet<Schedule[]>(url);
    log("[getSchedules] Response:", response);

    if (response.data) {
      cacheHelpers.schedules?.set(cacheKey, response.data);
    }

    return response.data;
  } catch (error) {
    handleError("getSchedules", error);
  }
}

/**
 * Buscar schedule por ID
 */
export async function getScheduleById(
  id: string
): Promise<Schedule | undefined> {
  try {
    if (!validateId(id)) {
      throw new Error("ID do schedule é obrigatório");
    }

    const cached = cacheHelpers.schedules?.get(id) as Schedule | null;
    if (cached) {
      log(`[getScheduleById] Cache hit for ID: ${id}`);
      return cached;
    }

    const response = await serverGet<Schedule>(`/schedule/${id}`);
    log(`[getScheduleById] Response for ID ${id}:`, response);

    if (response.data) {
      cacheHelpers.schedules?.set(id, response.data);
    }

    return response.data;
  } catch (error) {
    handleError("getScheduleById", error);
  }
}

/**
 * Buscar schedules de hoje
 */
export async function getTodaySchedules(): Promise<Schedule[] | undefined> {
  try {
    const cached = cacheHelpers.schedules?.get("today") as Schedule[] | null;

    if (cached) {
      log("[getTodaySchedules] Cache hit");
      return cached;
    }

    const response = await serverGet<Schedule[]>("/schedule/today");
    log("[getTodaySchedules] Response:", response);

    if (response.data) {
      cacheHelpers.schedules?.set("today", response.data);
    }

    return response.data;
  } catch (error) {
    handleError("getTodaySchedules", error);
  }
}

/**
 * Buscar estatísticas dos schedules
 */
export async function getScheduleStats(): Promise<ScheduleStatsResponse> {
  try {
    const cached = cacheHelpers.schedules?.get(
      "stats"
    ) as ScheduleStatsResponse | null;

    if (cached) {
      log("[getScheduleStats] Cache hit");
      return cached;
    }

    const response = await serverGet<ScheduleStatsResponse>("/schedule/stats");
    log("[getScheduleStats] Response:", response);

    if (response.data) {
      const result: ScheduleStatsResponse = {
        success: getApiSuccessStatus(response),
        data: response.data,
        message: response.message,
      };

      cacheHelpers.schedules?.set("stats", result);
      return result;
    }

    return {
      success: false,
      message: "Erro ao buscar estatísticas dos schedules",
    };
  } catch (error) {
    handleError("getScheduleStats", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

// ========================
// CREATE OPERATIONS
// ========================

/**
 * Criar um novo schedule
 */
export async function createSchedule(
  scheduleData: CreateScheduleInput
): Promise<ScheduleResponse> {
  try {
    // Validações básicas
    if (!scheduleData.title?.trim()) {
      throw new Error("Título é obrigatório");
    }

    if (!scheduleData.date) {
      throw new Error("Data é obrigatória");
    }

    log("[createSchedule] Input data:", scheduleData);

    const response = await serverPost<Schedule>("/schedule", scheduleData);
    log("[createSchedule] Response:", response);

    if (response.data) {
      // Invalidar cache relacionado
      cacheHelpers.schedules?.invalidateAll();
      log("[createSchedule] Cache invalidated");

      return {
        success: true,
        data: response.data,
        message: "Schedule criado com sucesso",
      };
    }

    return {
      success: false,
      message: "Erro ao criar schedule",
    };
  } catch (error) {
    handleError("createSchedule", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

// ========================
// UPDATE OPERATIONS
// ========================

/**
 * Atualizar um schedule existente
 */
export async function updateSchedule(
  scheduleData: UpdateScheduleInput
): Promise<ScheduleResponse> {
  try {
    if (!validateId(scheduleData.id)) {
      throw new Error("ID do schedule é obrigatório");
    }

    log(`[updateSchedule] Updating schedule ${scheduleData.id}:`, scheduleData);

    const { id, ...updateData } = scheduleData;
    const response = await serverPatch<Schedule>(`/schedule/${id}`, updateData);
    log(`[updateSchedule] Response for ID ${id}:`, response);

    if (response.data) {
      // Invalidar cache relacionado
      cacheHelpers.schedules?.invalidateAll();
      log("[updateSchedule] Cache invalidated");

      return {
        success: true,
        data: response.data,
        message: "Schedule atualizado com sucesso",
      };
    }

    return {
      success: false,
      message: "Erro ao atualizar schedule",
    };
  } catch (error) {
    handleError("updateSchedule", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

/**
 * Atualizar apenas o status de um schedule
 */
export async function updateScheduleStatus(
  id: string,
  status: ScheduleStatus
): Promise<ScheduleResponse> {
  try {
    if (!validateId(id)) {
      throw new Error("ID do schedule é obrigatório");
    }

    if (!status) {
      throw new Error("Status é obrigatório");
    }

    log(`[updateScheduleStatus] Updating status of schedule ${id} to:`, status);

    const response = await serverPatch<Schedule>(`/schedule/${id}/status`, {
      status,
    });
    log(`[updateScheduleStatus] Response for ID ${id}:`, response);

    if (response.data) {
      // Invalidar cache relacionado
      cacheHelpers.schedules?.invalidateAll();
      log("[updateScheduleStatus] Cache invalidated");

      return {
        success: true,
        data: response.data,
        message: "Status do schedule atualizado com sucesso",
      };
    }

    return {
      success: false,
      message: "Erro ao atualizar status do schedule",
    };
  } catch (error) {
    handleError("updateScheduleStatus", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

// ========================
// DELETE OPERATIONS
// ========================

/**
 * Deletar um schedule
 */
export async function deleteSchedule(id: string): Promise<ScheduleResponse> {
  try {
    if (!validateId(id)) {
      throw new Error("ID do schedule é obrigatório");
    }

    log(`[deleteSchedule] Deleting schedule: ${id}`);

    const response = await serverDelete(`/schedule/${id}`);
    log(`[deleteSchedule] Response for ID ${id}:`, response);

    if (getApiSuccessStatus(response)) {
      // Invalidar cache relacionado
      cacheHelpers.schedules?.invalidateAll();
      log("[deleteSchedule] Cache invalidated");

      return {
        success: true,
        message: "Schedule deletado com sucesso",
      };
    }

    return {
      success: false,
      message: "Erro ao deletar schedule",
    };
  } catch (error) {
    handleError("deleteSchedule", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

// ========================
// BULK OPERATIONS
// ========================

/**
 * Criar múltiplos schedules (batch)
 */
export async function createMultipleSchedules(
  schedulesData: CreateScheduleInput[]
): Promise<ScheduleResponse> {
  try {
    if (!Array.isArray(schedulesData) || schedulesData.length === 0) {
      throw new Error("Lista de schedules é obrigatória");
    }

    log("[createMultipleSchedules] Creating schedules:", schedulesData.length);

    const response = await serverPost<Schedule[]>("/schedule/batch", {
      schedules: schedulesData,
    });
    log("[createMultipleSchedules] Response:", response);

    if (response.data) {
      // Invalidar cache relacionado
      cacheHelpers.schedules?.invalidateAll();
      log("[createMultipleSchedules] Cache invalidated");

      return {
        success: true,
        data: response.data,
        message: `${schedulesData.length} schedules criados com sucesso`,
      };
    }

    return {
      success: false,
      message: "Erro ao criar schedules",
    };
  } catch (error) {
    handleError("createMultipleSchedules", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

/**
 * Deletar múltiplos schedules
 */
export async function deleteMultipleSchedules(
  ids: string[]
): Promise<ScheduleResponse> {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Lista de IDs é obrigatória");
    }

    // Validar todos os IDs
    for (const id of ids) {
      if (!validateId(id)) {
        throw new Error(`ID inválido: ${id}`);
      }
    }

    log("[deleteMultipleSchedules] Deleting schedules:", ids);

    const response = await serverDelete("/schedule/batch", { ids });
    log("[deleteMultipleSchedules] Response:", response);

    if (getApiSuccessStatus(response)) {
      // Invalidar cache relacionado
      cacheHelpers.schedules?.invalidateAll();
      log("[deleteMultipleSchedules] Cache invalidated");

      return {
        success: true,
        message: `${ids.length} schedules deletados com sucesso`,
      };
    }

    return {
      success: false,
      message: "Erro ao deletar schedules",
    };
  } catch (error) {
    handleError("deleteMultipleSchedules", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}

// ========================
// SEARCH AND FILTER OPERATIONS
// ========================

/**
 * Buscar schedules por data específica
 */
export async function getSchedulesByDate(
  date: string
): Promise<Schedule[] | undefined> {
  try {
    if (!date) {
      throw new Error("Data é obrigatória");
    }

    return await getSchedules({ date });
  } catch (error) {
    handleError("getSchedulesByDate", error);
  }
}

/**
 * Buscar schedules por status
 */
export async function getSchedulesByStatus(
  status: ScheduleStatus
): Promise<Schedule[] | undefined> {
  try {
    if (!status) {
      throw new Error("Status é obrigatório");
    }

    return await getSchedules({ status });
  } catch (error) {
    handleError("getSchedulesByStatus", error);
  }
}

/**
 * Buscar schedules por funcionário
 */
export async function getSchedulesByEmployee(
  employeeId: string
): Promise<Schedule[] | undefined> {
  try {
    if (!validateId(employeeId)) {
      throw new Error("ID do funcionário é obrigatório");
    }

    return await getSchedules({ employeeId });
  } catch (error) {
    handleError("getSchedulesByEmployee", error);
  }
}

/**
 * Buscar schedules públicos
 */
export async function getPublicSchedules(): Promise<Schedule[] | undefined> {
  try {
    return await getSchedules({ publicOnly: true });
  } catch (error) {
    handleError("getPublicSchedules", error);
  }
}

/**
 * Buscar schedules por período
 */
export async function getSchedulesByDateRange(
  startDate: string,
  endDate: string
): Promise<Schedule[] | undefined> {
  try {
    if (!startDate || !endDate) {
      throw new Error("Data de início e fim são obrigatórias");
    }

    return await getSchedules({ startDate, endDate });
  } catch (error) {
    handleError("getSchedulesByDateRange", error);
  }
}

/**
 * Pesquisar schedules por texto
 */
export async function searchSchedules(
  searchTerm: string
): Promise<Schedule[] | undefined> {
  try {
    if (!searchTerm?.trim()) {
      throw new Error("Termo de pesquisa é obrigatório");
    }

    return await getSchedules({ search: searchTerm.trim() });
  } catch (error) {
    handleError("searchSchedules", error);
  }
}
