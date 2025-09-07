"use server";

import {
  serverGet,
  serverPost,
  serverDelete,
  serverPatch,
} from "@/lib/server-api";
import type {
  Category,
  CategoryFilter,
  CategorySearchResult,
  CreateCategoryData,
  CategoryTree,
} from "@/types/categories";
import {
  log,
  handleError,
  validateId,
  buildQueryParams,
  generateSlug,
} from "@/utils";

// ==================== CRUD BÁSICO ====================

export async function getCategories(): Promise<Category[] | undefined> {
  try {
    const response = await serverGet<Category[]>("/categories");
    log("[getCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCategories", error);
  }
}

export async function getCategoryById(
  id: string
): Promise<Category | undefined> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverGet<Category>(`/categories/${id}`);
    log("[getCategoryById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCategoryById", error);
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  try {
    if (!slug?.trim()) {
      throw new Error("Slug da categoria é obrigatório");
    }

    const response = await serverGet<Category>(`/categories/slug/${slug}`);
    log("[getCategoryBySlug] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCategoryBySlug", error);
  }
}

export async function searchCategories(
  filters: CategoryFilter
): Promise<CategorySearchResult | undefined> {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await serverGet<CategorySearchResult>(
      `/categories/search?${queryParams.toString()}`
    );
    log("[searchCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("searchCategories", error);
  }
}

export async function createCategory(
  categoryData: CreateCategoryData
): Promise<Category | undefined> {
  try {
    if (!categoryData.name?.trim()) {
      throw new Error("Nome da categoria é obrigatório");
    }

    // Gerar slug se não fornecido
    if (!categoryData.slug) {
      categoryData.slug = generateSlug(categoryData.name);
    }

    // Validar se slug já existe
    const existingCategory = await getCategoryBySlug(categoryData.slug);
    if (existingCategory) {
      throw new Error("Já existe uma categoria com este slug");
    }

    const response = await serverPost<Category>("/categories", categoryData);
    log("[createCategory] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createCategory", error);
  }
}

export async function updateCategory(
  id: string,
  categoryData: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
): Promise<Category | undefined> {
  try {
    validateId(id, "ID da categoria");

    // Se o nome foi alterado e slug não foi fornecido, gerar novo slug
    if (categoryData.name && !categoryData.slug) {
      categoryData.slug = generateSlug(categoryData.name);
    }

    const response = await serverPatch<Category>(
      `/categories/${id}`,
      categoryData
    );
    log("[updateCategory] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateCategory", error);
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");

    // Verificar se tem produtos associados
    const response = await serverGet<{ productCount: number }>(
      `/categories/${id}/products/count`
    );

    if (response.data?.productCount && response.data.productCount > 0) {
      throw new Error(
        `Não é possível excluir categoria com ${response.data.productCount} produto(s) associado(s)`
      );
    }

    const deleteResponse = await serverDelete<{ success: boolean }>(
      `/categories/${id}`
    );
    log("[deleteCategory] Response:", deleteResponse);
    return deleteResponse.data?.success || false;
  } catch (error) {
    handleError("deleteCategory", error);
    return false;
  }
}

// ==================== HIERARQUIA DE CATEGORIAS ====================

export async function getCategoryTree(): Promise<CategoryTree[] | undefined> {
  try {
    const response = await serverGet<CategoryTree[]>("/categories/tree");
    log("[getCategoryTree] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCategoryTree", error);
  }
}

export async function getRootCategories(): Promise<Category[] | undefined> {
  try {
    const response = await serverGet<Category[]>("/categories/root");
    log("[getRootCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getRootCategories", error);
  }
}

export async function getChildCategories(
  parentId: string
): Promise<Category[] | undefined> {
  try {
    validateId(parentId, "ID da categoria pai");
    const response = await serverGet<Category[]>(
      `/categories/${parentId}/children`
    );
    log("[getChildCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getChildCategories", error);
  }
}

export async function getCategoryPath(
  id: string
): Promise<Category[] | undefined> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverGet<Category[]>(`/categories/${id}/path`);
    log("[getCategoryPath] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCategoryPath", error);
  }
}

export async function moveCategory(
  id: string,
  newParentId?: string
): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");

    if (newParentId && newParentId === id) {
      throw new Error("Categoria não pode ser pai de si mesma");
    }

    const response = await serverPatch<{ success: boolean }>(
      `/categories/${id}/move`,
      { parentId: newParentId }
    );
    log("[moveCategory] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("moveCategory", error);
    return false;
  }
}

// ==================== FUNCIONALIDADES ESPECÍFICAS ====================

export async function getFeaturedCategories(): Promise<Category[] | undefined> {
  try {
    const response = await serverGet<Category[]>("/categories/featured");
    log("[getFeaturedCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getFeaturedCategories", error);
  }
}

export async function getActiveCategories(): Promise<Category[] | undefined> {
  try {
    const response = await serverGet<Category[]>("/categories/active");
    log("[getActiveCategories] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getActiveCategories", error);
  }
}

export async function updateCategoryOrder(
  categoryOrders: Array<{ id: string; sortOrder: number }>
): Promise<boolean> {
  try {
    if (!categoryOrders?.length) {
      throw new Error("Lista de ordenação é obrigatória");
    }

    const response = await serverPatch<{ success: boolean }>(
      "/categories/reorder",
      { orders: categoryOrders }
    );
    log("[updateCategoryOrder] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("updateCategoryOrder", error);
    return false;
  }
}

export async function toggleCategoryStatus(
  id: string,
  isActive: boolean
): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverPatch<{ success: boolean }>(
      `/categories/${id}/status`,
      { isActive }
    );
    log("[toggleCategoryStatus] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("toggleCategoryStatus", error);
    return false;
  }
}

export async function toggleCategoryVisibility(
  id: string,
  isVisible: boolean
): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverPatch<{ success: boolean }>(
      `/categories/${id}/visibility`,
      { isVisible }
    );
    log("[toggleCategoryVisibility] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("toggleCategoryVisibility", error);
    return false;
  }
}

export async function toggleCategoryFeatured(
  id: string,
  isFeatured: boolean
): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverPatch<{ success: boolean }>(
      `/categories/${id}/featured`,
      { isFeatured }
    );
    log("[toggleCategoryFeatured] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("toggleCategoryFeatured", error);
    return false;
  }
}

// ==================== PRODUTOS POR CATEGORIA ====================

export async function getCategoryProductsCount(
  id: string
): Promise<number | undefined> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverGet<{ count: number }>(
      `/categories/${id}/products/count`
    );
    log("[getCategoryProductsCount] Response:", response);
    return response.data?.count;
  } catch (error) {
    handleError("getCategoryProductsCount", error);
  }
}

export async function updateCategoryProductCount(id: string): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");
    const response = await serverPatch<{ success: boolean }>(
      `/categories/${id}/update-product-count`,
      {}
    );
    log("[updateCategoryProductCount] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("updateCategoryProductCount", error);
    return false;
  }
}

// ==================== ESTATÍSTICAS ====================

export async function getCategoriesCount(): Promise<number | undefined> {
  try {
    const response = await serverGet<{ count: number }>("/categories/count");
    log("[getCategoriesCount] Response:", response);
    return response.data?.count;
  } catch (error) {
    handleError("getCategoriesCount", error);
  }
}

export async function getCategoriesStats(): Promise<
  | {
      total: number;
      active: number;
      inactive: number;
      featured: number;
      withProducts: number;
      withoutProducts: number;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      total: number;
      active: number;
      inactive: number;
      featured: number;
      withProducts: number;
      withoutProducts: number;
    }>("/categories/stats");
    log("[getCategoriesStats] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCategoriesStats", error);
  }
}

// ==================== VALIDAÇÕES ====================

export async function validateCategorySlug(
  slug: string,
  excludeId?: string
): Promise<{
  valid: boolean;
  message?: string;
  suggestion?: string;
}> {
  try {
    if (!slug?.trim()) {
      return { valid: false, message: "Slug é obrigatório" };
    }

    const cleanSlug = generateSlug(slug);
    const queryParams = new URLSearchParams({ slug: cleanSlug });

    if (excludeId) {
      queryParams.set("excludeId", excludeId);
    }

    const response = await serverGet<{
      valid: boolean;
      message?: string;
      suggestion?: string;
    }>(`/categories/validate-slug?${queryParams.toString()}`);

    log("[validateCategorySlug] Response:", response);
    return response.data || { valid: false, message: "Erro na validação" };
  } catch (error) {
    handleError("validateCategorySlug", error);
    return { valid: false, message: "Erro ao validar slug" };
  }
}

export async function checkCategoryHasProducts(id: string): Promise<boolean> {
  try {
    validateId(id, "ID da categoria");
    const count = await getCategoryProductsCount(id);
    return (count || 0) > 0;
  } catch (error) {
    handleError("checkCategoryHasProducts", error);
    return false;
  }
}
