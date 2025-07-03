"use server";

import {
  serverGet,
  serverPost,
  serverPut,
  serverDelete,
} from "@/lib/server-api";
import type {
  Product,
  ProductFilters,
  ProductStats,
  PaginatedResponse,
} from "@/types";

interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock?: number;
  category: string;
  status: "ativo" | "inativo";
}

// CRUD Operations
export async function getProducts(
  pagination?: { page?: number; limit?: number },
  filters?: any
) {
  try {
    const queryParams = new URLSearchParams();

    if (pagination?.page)
      queryParams.append("page", pagination.page.toString());
    if (pagination?.limit)
      queryParams.append("limit", pagination.limit.toString());

    const url = `/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet<PaginatedResponse<Product>>(url);

    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar produtos",
    };
  }
}

export async function getProduct(id: string) {
  try {
    const result = await serverGet<Product>(`/products/${id}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar produto",
    };
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.category,
      isActive: data.status === "ativo",
    };

    const result = await serverPost<Product>("/products", productData);
    return {
      success: true,
      data: result.data,
      message: "Produto criado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar produto",
    };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.category,
      isActive: data.status === "ativo",
    };

    const result = await serverPut<Product>(`/products/${id}`, productData);
    return {
      success: true,
      data: result.data,
      message: "Produto atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar produto",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await serverDelete(`/products/${id}`);
    return {
      success: true,
      message: "Produto excluído com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao excluir produto",
    };
  }
}

export async function getProductStats() {
  try {
    const result = await serverGet<ProductStats>("/products/stats");
    return {
      success: true,
      data: (result.data as any)?.data,
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
    const result = await serverGet<Product[]>(
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

export async function updateProductStock(id: string, stock: number) {
  try {
    const result = await serverPut<Product>(`/products/${id}/stock`, { stock });
    return {
      success: true,
      data: result.data,
      message: "Estoque atualizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao atualizar estoque",
    };
  }
}
