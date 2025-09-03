"use server";

import {
  serverGet,
  serverPost,
  serverDelete,
  serverPatch,
} from "@/lib/server-api";
import type {
  Order,
  OrderFilter,
  OrderSearchResult,
  CreateOrderData,
  OrderStatusUpdate,
} from "@/types/orders";
import {
  log,
  handleError,
  validateId,
  validateNonEmptyString,
  buildQueryParams,
  getApiCount,
  getApiSuccessStatus,
} from "@/utils";

// ==================== CRUD BÁSICO ====================

export async function getOrders(): Promise<Order[] | undefined> {
  try {
    const response = await serverGet<Order[]>("/orders");
    log("[getOrders] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getOrders", error);
  }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  try {
    validateId(id, "ID do pedido");
    const response = await serverGet<Order>(`/orders/${id}`);
    log("[getOrderById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getOrderById", error);
  }
}

export async function searchOrders(
  filters: OrderFilter
): Promise<OrderSearchResult | undefined> {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await serverGet<OrderSearchResult>(
      `/orders/search?${queryParams.toString()}`
    );
    log("[searchOrders] Response:", response);
    return response.data;
  } catch (error) {
    handleError("searchOrders", error);
  }
}

export async function createOrder(
  orderData: CreateOrderData
): Promise<Order | undefined> {
  try {
    if (!orderData.items?.length) {
      throw new Error("Pedido deve conter pelo menos um item");
    }

    if (!orderData.shippingAddress) {
      throw new Error("Endereço de entrega é obrigatório");
    }

    if (!orderData.paymentMethod) {
      throw new Error("Método de pagamento é obrigatório");
    }

    const response = await serverPost<Order>("/orders", orderData);
    log("[createOrder] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createOrder", error);
  }
}

export async function updateOrder(
  id: string,
  orderData: Partial<Order>
): Promise<Order | undefined> {
  try {
    validateId(id, "ID do pedido");
    const response = await serverPatch<Order>(`/orders/${id}`, orderData);
    log("[updateOrder] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateOrder", error);
  }
}

export async function cancelOrder(
  id: string,
  reason?: string
): Promise<boolean> {
  try {
    validateId(id, "ID do pedido");
    const response = await serverPatch<{ success: boolean }>(
      `/orders/${id}/cancel`,
      { reason }
    );
    log("[cancelOrder] Response:", response);
    return getApiSuccessStatus(response);
  } catch (error) {
    handleError("cancelOrder", error);
    return false;
  }
}

// ==================== FUNCIONALIDADES ESPECÍFICAS ====================

export async function getOrdersByUser(
  userId: string
): Promise<Order[] | undefined> {
  try {
    validateId(userId, "ID do usuário");
    const response = await serverGet<Order[]>(`/orders/user/${userId}`);
    log("[getOrdersByUser] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getOrdersByUser", error);
  }
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | undefined> {
  try {
    validateNonEmptyString(orderNumber, "Número do pedido");

    const response = await serverGet<Order>(`/orders/number/${orderNumber}`);
    log("[getOrderByNumber] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getOrderByNumber", error);
  }
}

export async function updateOrderStatus(
  id: string,
  statusUpdate: OrderStatusUpdate
): Promise<Order | undefined> {
  try {
    validateId(id, "ID do pedido");

    if (!statusUpdate.status) {
      throw new Error("Status é obrigatório");
    }

    const response = await serverPatch<Order>(
      `/orders/${id}/status`,
      statusUpdate
    );
    log("[updateOrderStatus] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateOrderStatus", error);
  }
}

export async function confirmOrder(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do pedido");
    const response = await serverPatch<{ success: boolean }>(
      `/orders/${id}/confirm`,
      {}
    );
    log("[confirmOrder] Response:", response);
    return getApiSuccessStatus(response);
  } catch (error) {
    handleError("confirmOrder", error);
    return false;
  }
}

export async function shipOrder(
  id: string,
  trackingNumber: string,
  estimatedDelivery?: Date
): Promise<boolean> {
  try {
    validateId(id, "ID do pedido");
    validateNonEmptyString(trackingNumber, "Código de rastreamento");

    const response = await serverPatch<{ success: boolean }>(
      `/orders/${id}/ship`,
      { trackingNumber, estimatedDelivery }
    );
    log("[shipOrder] Response:", response);
    return getApiSuccessStatus(response);
  } catch (error) {
    handleError("shipOrder", error);
    return false;
  }
}

export async function deliverOrder(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do pedido");
    const response = await serverPatch<{ success: boolean }>(
      `/orders/${id}/deliver`,
      {}
    );
    log("[deliverOrder] Response:", response);
    return getApiSuccessStatus(response);
  } catch (error) {
    handleError("deliverOrder", error);
    return false;
  }
}

// ==================== ESTATÍSTICAS E RELATÓRIOS ====================

export async function getOrdersCount(): Promise<number | undefined> {
  try {
    const response = await serverGet<{ count: number }>("/orders/count");
    log("[getOrdersCount] Response:", response);
    return getApiCount(response);
  } catch (error) {
    handleError("getOrdersCount", error);
  }
}

export async function getOrdersByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Order[] | undefined> {
  try {
    const response = await serverGet<Order[]>(
      `/orders/date-range?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );
    log("[getOrdersByDateRange] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getOrdersByDateRange", error);
  }
}

export async function getOrdersStats(): Promise<
  | {
      total: number;
      pending: number;
      confirmed: number;
      shipped: number;
      delivered: number;
      cancelled: number;
      totalRevenue: number;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      total: number;
      pending: number;
      confirmed: number;
      shipped: number;
      delivered: number;
      cancelled: number;
      totalRevenue: number;
    }>("/orders/stats");
    log("[getOrdersStats] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getOrdersStats", error);
  }
}

// ==================== VALIDAÇÕES E UTILITÁRIOS ====================

export async function validateOrderData(orderData: CreateOrderData): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  // Validar itens
  if (!orderData.items?.length) {
    errors.push("Pedido deve conter pelo menos um item");
  } else {
    orderData.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: ID do produto é obrigatório`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
      }
    });
  }

  // Validar endereço
  if (!orderData.shippingAddress) {
    errors.push("Endereço de entrega é obrigatório");
  } else {
    const addr = orderData.shippingAddress;
    if (!addr.firstName?.trim()) errors.push("Nome é obrigatório");
    if (!addr.lastName?.trim()) errors.push("Sobrenome é obrigatório");
    if (!addr.street?.trim()) errors.push("Endereço é obrigatório");
    if (!addr.city?.trim()) errors.push("Cidade é obrigatória");
    if (!addr.state?.trim()) errors.push("Estado é obrigatório");
    if (!addr.zipCode?.trim()) errors.push("CEP é obrigatório");
    if (!addr.country?.trim()) errors.push("País é obrigatório");
  }

  // Validar método de pagamento
  if (!orderData.paymentMethod) {
    errors.push("Método de pagamento é obrigatório");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function calculateOrderTotal(orderData: CreateOrderData): Promise<
  | {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    }
  | undefined
> {
  try {
    const response = await serverPost<{
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    }>("/orders/calculate", orderData);
    log("[calculateOrderTotal] Response:", response);
    return response.data;
  } catch (error) {
    handleError("calculateOrderTotal", error);
  }
}
