"use server";

import {
  serverGet,
  serverPost,
  serverDelete,
  serverPatch,
} from "@/lib/server-api";
import type {
  Product,
  ProductFilter,
  ProductSearchResult,
} from "@/types/products";
import {
  log,
  handleError,
  validateId,
  validateAmount,
  validateNonEmptyString,
  buildQueryParams,
  getApiCount,
  getApiSuccessStatus,
} from "@/utils";
import { cacheHelpers } from "@/lib/cache-utils";

export async function getProducts(): Promise<Product[] | undefined> {
  try {
    // Verifica se existe no cache primeiro
    const cached = cacheHelpers.products.get("all") as Product[] | null;
    if (cached) {
      log("[getProducts] Cache hit");
      return cached;
    }

    const response = await serverGet<Product[]>("/products");
    log("[getProducts] Response:", response);

    // Armazena no cache se a requisição foi bem-sucedida
    if (response.data) {
      cacheHelpers.products.set("all", response.data);
    }

    return response.data;
  } catch (error) {
    handleError("getProducts", error);
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    validateId(id, "ID do produto");

    // Verifica cache individual do produto
    const cached = cacheHelpers.products.get(id) as Product | null;
    if (cached) {
      log("[getProductById] Cache hit for product:", id);
      return cached;
    }

    const response = await serverGet<Product>(`/products/${id}`);
    log("[getProductById] Response:", response);

    // Armazena no cache individual
    if (response.data) {
      cacheHelpers.products.set(id, response.data);
    }

    return response.data;
  } catch (error) {
    handleError("getProductById", error);
  }
}

export async function searchProducts(
  filters: ProductFilter
): Promise<ProductSearchResult | undefined> {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await serverGet<ProductSearchResult>(
      `/products/search?${queryParams.toString()}`
    );
    log("[searchProducts] Response:", response);
    return response.data;
  } catch (error) {
    handleError("searchProducts", error);
  }
}

export async function getFeaturedProducts(): Promise<Product[] | undefined> {
  try {
    const response = await serverGet<Product[]>("/products/featured");
    log("[getFeaturedProducts] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getFeaturedProducts", error);
  }
}

export async function getProductsByCategory(
  categoryId: string,
  limit?: number
): Promise<Product[] | undefined> {
  try {
    validateId(categoryId, "ID da categoria");
    const url = `/products/category/${categoryId}${
      limit ? `?limit=${limit}` : ""
    }`;
    const response = await serverGet<Product[]>(url);
    log("[getProductsByCategory] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getProductsByCategory", error);
  }
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product | undefined> {
  try {
    validateNonEmptyString(product.name, "Nome do produto");
    validateAmount(product.price, "Preço");

    const response = await serverPost<Product>("/products", product);
    log("[createProduct] Response:", response);

    // Invalida cache de produtos após criação
    if (response.data) {
      cacheHelpers.products.invalidateAll();
      log("[createProduct] Cache invalidated");
    }

    return response.data;
  } catch (error) {
    handleError("createProduct", error);
  }
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<Product | undefined> {
  try {
    validateId(id, "ID do produto");
    const response = await serverPatch<Product>(`/products/${id}`, product);
    log("[updateProduct] Response:", response);

    // Invalida cache específico do produto e cache geral
    if (response.data) {
      cacheHelpers.products.invalidate(id);
      cacheHelpers.products.invalidate("all");
      log("[updateProduct] Cache invalidated for product:", id);
    }

    return response.data;
  } catch (error) {
    handleError("updateProduct", error);
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do produto");
    const response = await serverDelete<{ success: boolean }>(
      `/products/${id}`
    );
    log("[deleteProduct] Response:", response);

    const success = getApiSuccessStatus(response);

    // Invalida cache após deleção bem-sucedida
    if (success) {
      cacheHelpers.products.invalidate(id);
      cacheHelpers.products.invalidate("all");
      log("[deleteProduct] Cache invalidated for product:", id);
    }

    return success;
  } catch (error) {
    handleError("deleteProduct", error);
    return false;
  }
}

export async function getProductsCount(): Promise<number | undefined> {
  try {
    const response = await serverGet<{ count: number }>("/products/count");
    log("[getProductsCount] Response:", response);
    return getApiCount(response);
  } catch (error) {
    handleError("getProductsCount", error);
  }
}

export async function checkStock(
  productId: string
): Promise<number | undefined> {
  try {
    validateId(productId, "ID do produto");
    const response = await serverGet<{ stock: number }>(
      `/products/${productId}/stock`
    );
    log("[checkStock] Response:", response);
    return response.data?.stock;
  } catch (error) {
    handleError("checkStock", error);
  }
}

export async function updateStock(
  productId: string,
  quantity: number
): Promise<boolean> {
  try {
    validateId(productId, "ID do produto");

    if (typeof quantity !== "number" || quantity < 0) {
      throw new Error("Quantidade deve ser um número não negativo");
    }

    const response = await serverPatch<{ success: boolean }>(
      `/products/${productId}/stock`,
      { quantity }
    );
    log("[updateStock] Response:", response);
    return getApiSuccessStatus(response);
  } catch (error) {
    handleError("updateStock", error);
    return false;
  }
}
