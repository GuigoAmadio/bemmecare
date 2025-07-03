"use server";

import {
  serverGet,
  serverPost,
  serverPut,
  serverDelete,
} from "@/lib/server-api";
import type { PaginatedResponse } from "@/types";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  department?: string;
  isActive?: boolean;
}

interface UpdateEmployeeData
  extends Partial<Omit<CreateEmployeeData, "password">> {
  password?: string;
}

interface EmployeeFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
}

// CRUD Operations
export async function getEmployees(filters?: EmployeeFilters) {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.department)
      queryParams.append("department", filters.department);
    if (filters?.role) queryParams.append("role", filters.role);
    if (filters?.status) queryParams.append("status", filters.status);

    const url = `/employees${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet<PaginatedResponse<Employee>>(url);

    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar funcion�rios",
    };
  }
}

export async function getEmployee(id: string) {
  try {
    const result = await serverGet<Employee>(`/employees/${id}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar funcion�rio",
    };
  }
}

export async function createEmployee(data: CreateEmployeeData) {
  try {
    const result = await serverPost<Employee>("/employees", data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Funcion�rio criado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar funcion�rio",
    };
  }
}

export async function updateEmployee(id: string, data: UpdateEmployeeData) {
  try {
    const result = await serverPut<Employee>(`/employees/${id}`, data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Funcion�rio atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar funcion�rio",
    };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await serverDelete(`/employees/${id}`);
    return {
      success: true,
      message: "Funcion�rio exclu�do com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao excluir funcion�rio",
    };
  }
}

export async function updateEmployeeStatus(id: string, isActive: boolean) {
  try {
    const result = await serverPut<Employee>(`/employees/${id}/status`, {
      isActive,
    });
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Status do funcion�rio atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar status do funcion�rio",
    };
  }
}
