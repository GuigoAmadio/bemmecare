"use server";

import {
  serverGet,
  serverPost,
  serverDelete,
  serverPatch,
} from "@/lib/server-api";
import type { Cart, CartItem, ShippingOption } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/products";
import {
  log,
  handleError,
  validateId,
  validateQuantity,
  validateNonEmptyString,
  getApiSuccessStatus,
  getApiCount,
} from "@/utils";

// ==================== CARRINHO BÁSICO ====================

export async function getCart(): Promise<Cart | undefined> {
  try {
    const response = await serverGet<Cart>("/cart");
    log("[getCart] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCart", error);
  }
}

export async function getCartById(cartId: string): Promise<Cart | undefined> {
  try {
    validateId(cartId, "ID do carrinho");
    const response = await serverGet<Cart>(`/cart/${cartId}`);
    log("[getCartById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCartById", error);
  }
}

export async function createCart(): Promise<Cart | undefined> {
  try {
    const response = await serverPost<Cart>("/cart", {});
    log("[createCart] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createCart", error);
  }
}

export async function clearCart(): Promise<boolean> {
  try {
    const response = await serverDelete<{ success: boolean }>("/cart");
    log("[clearCart] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("clearCart", error);
    return false;
  }
}

// ==================== GERENCIAMENTO DE ITENS ====================

export async function addItemToCart(
  productId: string,
  quantity: number = 1,
  variants?: Record<string, ProductVariant>
): Promise<CartItem | undefined> {
  try {
    validateId(productId, "ID do produto");
    validateQuantity(quantity);

    const response = await serverPost<CartItem>("/cart/items", {
      productId,
      quantity,
      variants,
    });
    log("[addItemToCart] Response:", response);
    return response.data;
  } catch (error) {
    handleError("addItemToCart", error);
  }
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<CartItem | undefined> {
  try {
    validateId(itemId, "ID do item");

    if (quantity < 0) {
      throw new Error("Quantidade não pode ser negativa");
    }

    if (quantity > 99) {
      throw new Error("Quantidade máxima é 99");
    }

    // Se quantidade for 0, remover item
    if (quantity === 0) {
      await removeItemFromCart(itemId);
      return undefined;
    }

    const response = await serverPatch<CartItem>(`/cart/items/${itemId}`, {
      quantity,
    });
    log("[updateCartItemQuantity] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateCartItemQuantity", error);
  }
}

export async function removeItemFromCart(itemId: string): Promise<boolean> {
  try {
    validateId(itemId, "ID do item");
    const response = await serverDelete<{ success: boolean }>(
      `/cart/items/${itemId}`
    );
    log("[removeItemFromCart] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("removeItemFromCart", error);
    return false;
  }
}

export async function updateCartItemVariants(
  itemId: string,
  variants: Record<string, ProductVariant>
): Promise<CartItem | undefined> {
  try {
    validateId(itemId, "ID do item");

    const response = await serverPatch<CartItem>(
      `/cart/items/${itemId}/variants`,
      {
        variants,
      }
    );
    log("[updateCartItemVariants] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateCartItemVariants", error);
  }
}

// ==================== CUPONS E DESCONTOS ====================

export async function applyCoupon(couponCode: string): Promise<{
  success: boolean;
  discount: number;
  message?: string;
}> {
  try {
    if (!couponCode?.trim()) {
      throw new Error("Código do cupom é obrigatório");
    }

    const response = await serverPost<{
      success: boolean;
      discount: number;
      message?: string;
    }>("/cart/coupon", { couponCode });
    log("[applyCoupon] Response:", response);
    return (
      response.data || {
        success: false,
        discount: 0,
        message: "Erro ao aplicar cupom",
      }
    );
  } catch (error) {
    handleError("applyCoupon", error);
    return { success: false, discount: 0, message: "Erro ao aplicar cupom" };
  }
}

export async function removeCoupon(): Promise<boolean> {
  try {
    const response = await serverDelete<{ success: boolean }>("/cart/coupon");
    log("[removeCoupon] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("removeCoupon", error);
    return false;
  }
}

export async function validateCoupon(couponCode: string): Promise<{
  valid: boolean;
  discount: number;
  message?: string;
  expiresAt?: Date;
  minOrderValue?: number;
}> {
  try {
    if (!couponCode?.trim()) {
      return {
        valid: false,
        discount: 0,
        message: "Código do cupom é obrigatório",
      };
    }

    const response = await serverGet<{
      valid: boolean;
      discount: number;
      message?: string;
      expiresAt?: Date;
      minOrderValue?: number;
    }>(`/cart/coupon/validate/${encodeURIComponent(couponCode)}`);
    log("[validateCoupon] Response:", response);
    return (
      response.data || { valid: false, discount: 0, message: "Cupom inválido" }
    );
  } catch (error) {
    handleError("validateCoupon", error);
    return { valid: false, discount: 0, message: "Erro ao validar cupom" };
  }
}

// ==================== CÁLCULOS DE FRETE ====================

export async function calculateShipping(address: {
  zipCode: string;
  state: string;
  city: string;
}): Promise<ShippingOption[] | undefined> {
  try {
    if (!address.zipCode?.trim()) {
      throw new Error("CEP é obrigatório");
    }

    if (!address.state?.trim()) {
      throw new Error("Estado é obrigatório");
    }

    if (!address.city?.trim()) {
      throw new Error("Cidade é obrigatória");
    }

    const response = await serverPost<ShippingOption[]>(
      "/cart/shipping",
      address
    );
    log("[calculateShipping] Response:", response);
    return response.data;
  } catch (error) {
    handleError("calculateShipping", error);
  }
}

export async function selectShippingOption(
  shippingOptionId: string
): Promise<Cart | undefined> {
  try {
    validateId(shippingOptionId, "ID da opção de frete");

    const response = await serverPatch<Cart>("/cart/shipping", {
      shippingOptionId,
    });
    log("[selectShippingOption] Response:", response);
    return response.data;
  } catch (error) {
    handleError("selectShippingOption", error);
  }
}

// ==================== CÁLCULOS TOTAIS ====================

export async function recalculateCart(): Promise<Cart | undefined> {
  try {
    const response = await serverPatch<Cart>("/cart/recalculate", {});
    log("[recalculateCart] Response:", response);
    return response.data;
  } catch (error) {
    handleError("recalculateCart", error);
  }
}

export async function getCartTotals(): Promise<
  | {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
      itemCount: number;
      weight: number;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
      itemCount: number;
      weight: number;
    }>("/cart/totals");
    log("[getCartTotals] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCartTotals", error);
  }
}

// ==================== VALIDAÇÕES ====================

export async function validateCartForCheckout(): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  try {
    const response = await serverGet<{
      valid: boolean;
      errors: string[];
      warnings: string[];
    }>("/cart/validate");
    log("[validateCartForCheckout] Response:", response);
    return (
      response.data || {
        valid: false,
        errors: ["Erro na validação"],
        warnings: [],
      }
    );
  } catch (error) {
    handleError("validateCartForCheckout", error);
    return { valid: false, errors: ["Erro na validação"], warnings: [] };
  }
}

export async function checkProductAvailability(productId: string): Promise<{
  available: boolean;
  stock: number;
  maxQuantity: number;
}> {
  try {
    validateId(productId, "ID do produto");

    const response = await serverGet<{
      available: boolean;
      stock: number;
      maxQuantity: number;
    }>(`/cart/product/${productId}/availability`);
    log("[checkProductAvailability] Response:", response);
    return response.data || { available: false, stock: 0, maxQuantity: 0 };
  } catch (error) {
    handleError("checkProductAvailability", error);
    return { available: false, stock: 0, maxQuantity: 0 };
  }
}

export async function validateCartItems(): Promise<{
  valid: boolean;
  invalidItems: Array<{
    itemId: string;
    productId: string;
    reason: string;
    action: "remove" | "update_quantity" | "update_price";
    newQuantity?: number;
    newPrice?: number;
  }>;
}> {
  try {
    const response = await serverGet<{
      valid: boolean;
      invalidItems: Array<{
        itemId: string;
        productId: string;
        reason: string;
        action: "remove" | "update_quantity" | "update_price";
        newQuantity?: number;
        newPrice?: number;
      }>;
    }>("/cart/validate-items");
    log("[validateCartItems] Response:", response);
    return response.data || { valid: true, invalidItems: [] };
  } catch (error) {
    handleError("validateCartItems", error);
    return { valid: false, invalidItems: [] };
  }
}

// ==================== CARRINHO SALVO ====================

export async function saveCartForLater(): Promise<{
  success: boolean;
  cartId: string;
}> {
  try {
    const response = await serverPost<{ success: boolean; cartId: string }>(
      "/cart/save",
      {}
    );
    log("[saveCartForLater] Response:", response);
    return response.data || { success: false, cartId: "" };
  } catch (error) {
    handleError("saveCartForLater", error);
    return { success: false, cartId: "" };
  }
}

export async function restoreSavedCart(
  cartId: string
): Promise<Cart | undefined> {
  try {
    validateId(cartId, "ID do carrinho salvo");

    const response = await serverPost<Cart>(`/cart/restore/${cartId}`, {});
    log("[restoreSavedCart] Response:", response);
    return response.data;
  } catch (error) {
    handleError("restoreSavedCart", error);
  }
}

export async function getSavedCarts(): Promise<
  | Array<{
      id: string;
      itemCount: number;
      total: number;
      savedAt: Date;
    }>
  | undefined
> {
  try {
    const response = await serverGet<
      Array<{
        id: string;
        itemCount: number;
        total: number;
        savedAt: Date;
      }>
    >("/cart/saved");
    log("[getSavedCarts] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getSavedCarts", error);
  }
}

export async function deleteSavedCart(cartId: string): Promise<boolean> {
  try {
    validateId(cartId, "ID do carrinho salvo");

    const response = await serverDelete<{ success: boolean }>(
      `/cart/saved/${cartId}`
    );
    log("[deleteSavedCart] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("deleteSavedCart", error);
    return false;
  }
}

// ==================== UTILITÁRIOS ====================

export async function mergeGuestCart(
  guestCartItems: CartItem[]
): Promise<Cart | undefined> {
  try {
    if (!guestCartItems?.length) {
      return await getCart();
    }

    const response = await serverPost<Cart>("/cart/merge", {
      items: guestCartItems,
    });
    log("[mergeGuestCart] Response:", response);
    return response.data;
  } catch (error) {
    handleError("mergeGuestCart", error);
  }
}

export async function getCartItemCount(): Promise<number> {
  try {
    const response = await serverGet<{ count: number }>("/cart/count");
    log("[getCartItemCount] Response:", response);
    return response.data?.count || 0;
  } catch (error) {
    handleError("getCartItemCount", error);
    return 0;
  }
}
