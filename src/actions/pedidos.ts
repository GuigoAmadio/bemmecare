"use server";

import { serverGet, serverPost } from "@/lib/server-api";

export interface EcommerceOrder {
  id: string;
  customerId: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  items: OrderItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  shippingAddress?: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CreateOrderDto {
  shippingAddressId?: string;
  paymentMethod?: string;
  notes?: string;
}

export async function createOrderFromCart(data: CreateOrderDto) {
  try {
    const result = await serverPost<EcommerceOrder>(
      "/ecommerce/orders/from-cart",
      data
    );
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Pedido criado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar pedido",
    };
  }
}

export async function getMyOrders() {
  try {
    const result = await serverGet<EcommerceOrder[]>(
      "/ecommerce/orders/my-orders"
    );
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao buscar pedidos",
    };
  }
}

export async function getOrder(id: string) {
  try {
    const result = await serverGet<EcommerceOrder>(`/ecommerce/orders/${id}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao buscar pedido",
    };
  }
}

export async function getAllOrders() {
  try {
    const result = await serverGet<EcommerceOrder[]>(
      "/ecommerce/orders/admin/all"
    );
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao buscar pedidos",
    };
  }
}

export async function getTopSellingProducts(limit: number = 5) {
  try {
    const result = await serverGet(`/products/top-selling?limit=${limit}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao buscar produtos mais vendidos",
    };
  }
}

// Aliases para compatibilidade com a página de vendas
export { getAllOrders as getVendas };
export { getOrder as getEstatisticasVendas };

// Tipos para compatibilidade
export type Venda = EcommerceOrder;
export interface FiltrosVenda {
  status?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}
export interface EstatisticasVenda {
  totalVendas: number;
  valorTotal: number;
  ticketMedio: number;
  crescimento: number;
}
