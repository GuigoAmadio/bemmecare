"use server";

import {
  serverGet,
  serverPost,
  serverPut,
  serverDelete,
} from "@/lib/server-api";
import type {
  Product,
  ProductStats,
  ProductFilters,
  PaginationParams,
  CreateProductData,
  UpdateProductData,
  ApiResponse,
  PaginatedResponse,
  TopSellingProduct,
} from "@/types";

// Obter estatísticas de produtos
export async function getProductStats(): Promise<ApiResponse<ProductStats>> {
  try {
    const result = await serverGet<ProductStats>("/products/stats");
    return {
      success: true,
      data: result.data,
      message: "Estatísticas de produtos carregadas com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar estatísticas de produtos:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter produtos mais vendidos
export async function getTopSellingProducts(
  limit: number = 5
): Promise<ApiResponse<TopSellingProduct[]>> {
  try {
    const result = await serverGet<TopSellingProduct[]>(
      `/products/top-selling?limit=${limit}`
    );
    return {
      success: true,
      data: result.data,
      message: "Produtos mais vendidos carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar produtos mais vendidos:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter produtos com estoque baixo
export async function getLowStockProducts(
  threshold: number = 10
): Promise<ApiResponse<Product[]>> {
  try {
    const result = await serverGet<Product[]>(
      `/products/low-stock?threshold=${threshold}`
    );
    return {
      success: true,
      data: result.data,
      message: "Produtos com estoque baixo carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar produtos com estoque baixo:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Listar produtos com filtros e paginação
export async function getProducts(
  pagination: PaginationParams = { page: 1, limit: 10 },
  filters: ProductFilters = {}
): Promise<ApiResponse<PaginatedResponse<Product>>> {
  try {
    const params = new URLSearchParams();

    // Adicionar parâmetros de paginação
    if (pagination.page) params.append("page", pagination.page.toString());
    if (pagination.limit) params.append("limit", pagination.limit.toString());

    // Adicionar filtros
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.priceMin !== undefined)
      params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax !== undefined)
      params.append("priceMax", filters.priceMax.toString());
    if (filters.inStock !== undefined)
      params.append("inStock", filters.inStock.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const result = await serverGet<PaginatedResponse<Product>>(
      `/products?${params.toString()}`
    );
    return {
      success: true,
      data: result.data,
      message: "Produtos carregados com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar produtos:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Obter produto por ID
export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  try {
    const result = await serverGet<Product>(`/products/${id}`);
    return {
      success: true,
      data: result.data,
      message: "Produto carregado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao carregar produto:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Produto não encontrado",
    };
  }
}

// Criar produto
export async function createProduct(
  data: CreateProductData
): Promise<ApiResponse<Product>> {
  try {
    const result = await serverPost<Product>("/products", data);
    return {
      success: true,
      data: result.data,
      message: "Produto criado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao criar produto:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao criar produto",
    };
  }
}

// Atualizar produto
export async function updateProduct(
  id: string,
  data: UpdateProductData
): Promise<ApiResponse<Product>> {
  try {
    const result = await serverPut<Product>(`/products/${id}`, data);
    return {
      success: true,
      data: result.data,
      message: "Produto atualizado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar produto:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar produto",
    };
  }
}

// Deletar produto
export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  try {
    await serverDelete(`/products/${id}`);
    return {
      success: true,
      message: "Produto deletado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao deletar produto:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao deletar produto",
    };
  }
}

// Atualizar estoque do produto
export async function updateProductStock(
  id: string,
  stock: number
): Promise<ApiResponse<Product>> {
  try {
    const result = await serverPut<Product>(`/products/${id}/stock`, { stock });
    return {
      success: true,
      data: result.data,
      message: "Estoque atualizado com sucesso",
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar estoque:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar estoque",
    };
  }
}
