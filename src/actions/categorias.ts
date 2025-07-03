"use server";

import { serverGet, serverPost } from "@/lib/server-api";
import type { Category } from "@/types";

interface CreateCategoryData {
  name: string;
  color?: string;
  type?: string;
  description?: string;
}

export async function getCategories() {
  try {
    const result = await serverGet<Category[]>("/appointments/categories");
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar categorias",
    };
  }
}

export async function createCategory(data: CreateCategoryData) {
  try {
    const result = await serverPost<Category>("/appointments/categories", data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Categoria criada com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar categoria",
    };
  }
}
