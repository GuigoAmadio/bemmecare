"use server";

import { serverGet, serverPost, serverPatch } from "@/lib/server-api";
import type {
  PaymentMethod,
  PaymentTransaction,
  PaymentRefund,
  PaymentFilter,
  PaymentSearchResult,
  CreatePaymentData,
  PaymentGatewayResponse,
} from "@/types/payments";
import { log, handleError, validateId, buildQueryParams } from "@/utils";

// ==================== MÉTODOS DE PAGAMENTO ====================

export async function getPaymentMethods(): Promise<
  PaymentMethod[] | undefined
> {
  try {
    const response = await serverGet<PaymentMethod[]>("/payment-methods");
    log("[getPaymentMethods] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentMethods", error);
  }
}

export async function getActivePaymentMethods(): Promise<
  PaymentMethod[] | undefined
> {
  try {
    const response = await serverGet<PaymentMethod[]>(
      "/payment-methods/active"
    );
    log("[getActivePaymentMethods] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getActivePaymentMethods", error);
  }
}

export async function getPaymentMethodById(
  id: string
): Promise<PaymentMethod | undefined> {
  try {
    validateId(id, "ID do método de pagamento");
    const response = await serverGet<PaymentMethod>(`/payment-methods/${id}`);
    log("[getPaymentMethodById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentMethodById", error);
  }
}

// ==================== TRANSAÇÕES ====================

export async function getPaymentTransactions(): Promise<
  PaymentTransaction[] | undefined
> {
  try {
    const response = await serverGet<PaymentTransaction[]>("/payments");
    log("[getPaymentTransactions] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentTransactions", error);
  }
}

export async function getPaymentTransactionById(
  id: string
): Promise<PaymentTransaction | undefined> {
  try {
    validateId(id, "ID da transação");
    const response = await serverGet<PaymentTransaction>(`/payments/${id}`);
    log("[getPaymentTransactionById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentTransactionById", error);
  }
}

export async function searchPaymentTransactions(
  filters: PaymentFilter
): Promise<PaymentSearchResult | undefined> {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await serverGet<PaymentSearchResult>(
      `/payments/search?${queryParams.toString()}`
    );
    log("[searchPaymentTransactions] Response:", response);
    return response.data;
  } catch (error) {
    handleError("searchPaymentTransactions", error);
  }
}

export async function getPaymentsByOrder(
  orderId: string
): Promise<PaymentTransaction[] | undefined> {
  try {
    validateId(orderId, "ID do pedido");
    const response = await serverGet<PaymentTransaction[]>(
      `/payments/order/${orderId}`
    );
    log("[getPaymentsByOrder] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentsByOrder", error);
  }
}

// ==================== PROCESSAMENTO DE PAGAMENTOS ====================

export async function createPayment(
  paymentData: CreatePaymentData
): Promise<PaymentGatewayResponse | undefined> {
  try {
    validateId(paymentData.orderId, "ID do pedido");
    validateId(paymentData.paymentMethodId, "ID do método de pagamento");

    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    if (!paymentData.currency?.trim()) {
      throw new Error("Moeda é obrigatória");
    }

    // Validações específicas por método
    const paymentMethod = await getPaymentMethodById(
      paymentData.paymentMethodId
    );
    if (!paymentMethod) {
      throw new Error("Método de pagamento não encontrado");
    }

    if (!paymentMethod.isActive) {
      throw new Error("Método de pagamento não está ativo");
    }

    if (
      paymentMethod.minAmount &&
      paymentData.amount < paymentMethod.minAmount
    ) {
      throw new Error(
        `Valor mínimo para este método é ${paymentMethod.minAmount}`
      );
    }

    if (
      paymentMethod.maxAmount &&
      paymentData.amount > paymentMethod.maxAmount
    ) {
      throw new Error(
        `Valor máximo para este método é ${paymentMethod.maxAmount}`
      );
    }

    // Validações específicas para cartão
    if (
      paymentMethod.type === "credit_card" ||
      paymentMethod.type === "debit_card"
    ) {
      if (!paymentData.cardData) {
        throw new Error("Dados do cartão são obrigatórios");
      }

      const { cardData } = paymentData;
      if (!cardData.number?.replace(/\s/g, "")) {
        throw new Error("Número do cartão é obrigatório");
      }

      if (!cardData.holderName?.trim()) {
        throw new Error("Nome do portador é obrigatório");
      }

      if (
        !cardData.expiryMonth ||
        cardData.expiryMonth < 1 ||
        cardData.expiryMonth > 12
      ) {
        throw new Error("Mês de expiração inválido");
      }

      if (
        !cardData.expiryYear ||
        cardData.expiryYear < new Date().getFullYear()
      ) {
        throw new Error("Ano de expiração inválido");
      }

      if (!cardData.cvv || cardData.cvv.length < 3) {
        throw new Error("CVV inválido");
      }
    }

    const response = await serverPost<PaymentGatewayResponse>(
      "/payments/process",
      paymentData
    );
    log("[createPayment] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createPayment", error);
  }
}

export async function confirmPayment(
  transactionId: string
): Promise<PaymentTransaction | undefined> {
  try {
    validateId(transactionId, "ID da transação");

    const response = await serverPatch<PaymentTransaction>(
      `/payments/${transactionId}/confirm`,
      {}
    );
    log("[confirmPayment] Response:", response);
    return response.data;
  } catch (error) {
    handleError("confirmPayment", error);
  }
}

export async function cancelPayment(
  transactionId: string,
  reason?: string
): Promise<boolean> {
  try {
    validateId(transactionId, "ID da transação");

    const response = await serverPatch<{ success: boolean }>(
      `/payments/${transactionId}/cancel`,
      { reason }
    );
    log("[cancelPayment] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("cancelPayment", error);
    return false;
  }
}

// ==================== REEMBOLSOS ====================

export async function createRefund(
  transactionId: string,
  amount: number,
  reason: string
): Promise<PaymentRefund | undefined> {
  try {
    validateId(transactionId, "ID da transação");

    if (!amount || amount <= 0) {
      throw new Error("Valor do reembolso deve ser maior que zero");
    }

    if (!reason?.trim()) {
      throw new Error("Motivo do reembolso é obrigatório");
    }

    const response = await serverPost<PaymentRefund>("/payments/refunds", {
      transactionId,
      amount,
      reason,
    });
    log("[createRefund] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createRefund", error);
  }
}

export async function getRefunds(
  transactionId?: string
): Promise<PaymentRefund[] | undefined> {
  try {
    const url = transactionId
      ? `/payments/refunds?transactionId=${transactionId}`
      : "/payments/refunds";

    const response = await serverGet<PaymentRefund[]>(url);
    log("[getRefunds] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getRefunds", error);
  }
}

export async function getRefundById(
  refundId: string
): Promise<PaymentRefund | undefined> {
  try {
    validateId(refundId, "ID do reembolso");
    const response = await serverGet<PaymentRefund>(
      `/payments/refunds/${refundId}`
    );
    log("[getRefundById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getRefundById", error);
  }
}

// ==================== STATUS E WEBHOOK ====================

export async function updatePaymentStatus(
  transactionId: string,
  status: PaymentTransaction["status"],
  externalTransactionId?: string
): Promise<PaymentTransaction | undefined> {
  try {
    validateId(transactionId, "ID da transação");

    const validStatuses: PaymentTransaction["status"][] = [
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
      "refunded",
      "partially_refunded",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error("Status inválido");
    }

    const response = await serverPatch<PaymentTransaction>(
      `/payments/${transactionId}/status`,
      { status, externalTransactionId }
    );
    log("[updatePaymentStatus] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updatePaymentStatus", error);
  }
}

export async function handlePaymentWebhook(webhookData: {
  transactionId: string;
  externalTransactionId?: string;
  status: PaymentTransaction["status"];
  amount?: number;
  gatewayData?: any;
}): Promise<boolean> {
  try {
    validateId(webhookData.transactionId, "ID da transação");

    const response = await serverPost<{ success: boolean }>(
      "/payments/webhook",
      webhookData
    );
    log("[handlePaymentWebhook] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("handlePaymentWebhook", error);
    return false;
  }
}

// ==================== VALIDAÇÕES ====================

export async function validateCardNumber(cardNumber: string): Promise<{
  valid: boolean;
  brand?: string;
  message?: string;
}> {
  try {
    if (!cardNumber?.trim()) {
      return { valid: false, message: "Número do cartão é obrigatório" };
    }

    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (!/^\d+$/.test(cleanNumber)) {
      return {
        valid: false,
        message: "Número do cartão deve conter apenas dígitos",
      };
    }

    const response = await serverPost<{
      valid: boolean;
      brand?: string;
      message?: string;
    }>("/payments/validate-card", { cardNumber: cleanNumber });
    log("[validateCardNumber] Response:", response);
    return response.data || { valid: false, message: "Cartão inválido" };
  } catch (error) {
    handleError("validateCardNumber", error);
    return { valid: false, message: "Erro ao validar cartão" };
  }
}

export async function validatePaymentAmount(
  amount: number,
  paymentMethodId: string
): Promise<{
  valid: boolean;
  message?: string;
  fee?: number;
  netAmount?: number;
}> {
  try {
    if (!amount || amount <= 0) {
      return { valid: false, message: "Valor deve ser maior que zero" };
    }

    validateId(paymentMethodId, "ID do método de pagamento");

    const response = await serverPost<{
      valid: boolean;
      message?: string;
      fee?: number;
      netAmount?: number;
    }>("/payments/validate-amount", { amount, paymentMethodId });
    log("[validatePaymentAmount] Response:", response);
    return response.data || { valid: false, message: "Valor inválido" };
  } catch (error) {
    handleError("validatePaymentAmount", error);
    return { valid: false, message: "Erro ao validar valor" };
  }
}

// ==================== RELATÓRIOS E ESTATÍSTICAS ====================

export async function getPaymentStats(): Promise<
  | {
      total: number;
      completed: number;
      pending: number;
      failed: number;
      refunded: number;
      totalAmount: number;
      totalRefunded: number;
      byMethod: Record<string, number>;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      total: number;
      completed: number;
      pending: number;
      failed: number;
      refunded: number;
      totalAmount: number;
      totalRefunded: number;
      byMethod: Record<string, number>;
    }>("/payments/stats");
    log("[getPaymentStats] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentStats", error);
  }
}

export async function getPaymentsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<PaymentTransaction[] | undefined> {
  try {
    const response = await serverGet<PaymentTransaction[]>(
      `/payments/date-range?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );
    log("[getPaymentsByDateRange] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentsByDateRange", error);
  }
}

export async function getPaymentAnalytics(
  period: "day" | "week" | "month" | "year"
): Promise<
  | {
      revenue: Array<{ date: string; amount: number; count: number }>;
      methods: Array<{ method: string; amount: number; percentage: number }>;
      status: Array<{ status: string; count: number; percentage: number }>;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      revenue: Array<{ date: string; amount: number; count: number }>;
      methods: Array<{ method: string; amount: number; percentage: number }>;
      status: Array<{ status: string; count: number; percentage: number }>;
    }>(`/payments/analytics?period=${period}`);
    log("[getPaymentAnalytics] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getPaymentAnalytics", error);
  }
}

// ==================== UTILITÁRIOS ====================

export async function calculatePaymentFee(
  amount: number,
  paymentMethodId: string,
  installments?: number
): Promise<
  | {
      fee: number;
      netAmount: number;
      installmentAmount?: number;
    }
  | undefined
> {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    validateId(paymentMethodId, "ID do método de pagamento");

    const response = await serverPost<{
      fee: number;
      netAmount: number;
      installmentAmount?: number;
    }>("/payments/calculate-fee", { amount, paymentMethodId, installments });
    log("[calculatePaymentFee] Response:", response);
    return response.data;
  } catch (error) {
    handleError("calculatePaymentFee", error);
  }
}

export async function getInstallmentOptions(
  amount: number,
  paymentMethodId: string
): Promise<
  | Array<{
      installments: number;
      installmentAmount: number;
      totalAmount: number;
      fee: number;
    }>
  | undefined
> {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    validateId(paymentMethodId, "ID do método de pagamento");

    const response = await serverGet<
      Array<{
        installments: number;
        installmentAmount: number;
        totalAmount: number;
        fee: number;
      }>
    >(
      `/payments/installments?amount=${amount}&paymentMethodId=${paymentMethodId}`
    );
    log("[getInstallmentOptions] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getInstallmentOptions", error);
  }
}
