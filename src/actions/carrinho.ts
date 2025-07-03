"use server";

import { serverGet, serverPost, serverDelete } from "@/lib/server-api";

interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface AddToCartData {
  productId: string;
  quantity: number;
}

export async function getCart() {
  try {
    const result = await serverGet<Cart>("/ecommerce/cart");
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao carregar carrinho",
    };
  }
}

export async function addToCart(data: AddToCartData) {
  try {
    const result = await serverPost<Cart>("/ecommerce/cart/add", data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Produto adicionado ao carrinho",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao adicionar produto ao carrinho",
    };
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const result = await serverDelete<Cart>(`/ecommerce/cart/items/${itemId}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Item removido do carrinho",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao remover item do carrinho",
    };
  }
}
