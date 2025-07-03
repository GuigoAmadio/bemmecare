"use server";

import {
  serverGet,
  serverPost,
  serverPatch,
  serverDelete,
} from "@/lib/server-api";
import type { PaginatedResponse } from "@/types";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateServiceData {
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive?: boolean;
}

interface UpdateServiceData extends Partial<CreateServiceData> {}

interface ServiceFilters {
  search?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
}

// CRUD Operations
export async function getServices(filters?: ServiceFilters) {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.status) queryParams.append("status", filters.status);

    const url = `/services${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet<PaginatedResponse<Service>>(url);

    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar servi�os",
    };
  }
}

export async function getService(id: string) {
  try {
    const result = await serverGet<Service>(`/services/${id}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar servi�o",
    };
  }
}

export async function createService(data: CreateServiceData) {
  try {
    const result = await serverPost<Service>("/services", data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Servi�o criado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar servi�o",
    };
  }
}

export async function updateService(id: string, data: UpdateServiceData) {
  try {
    const result = await serverPatch<Service>(`/services/${id}`, data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Servi�o atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar servi�o",
    };
  }
}

export async function deleteService(id: string) {
  try {
    await serverDelete(`/services/${id}`);
    return {
      success: true,
      message: "Servi�o exclu�do com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao excluir servi�o",
    };
  }
}

export async function updateServiceStatus(id: string, isActive: boolean) {
  try {
    const result = await serverPatch<Service>(`/services/${id}/status`, {
      isActive,
    });
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Status do servi�o atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar status do servi�o",
    };
  }
}
