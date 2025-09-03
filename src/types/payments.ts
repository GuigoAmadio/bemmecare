export interface PaymentMethod {
  id: string;
  type:
    | "credit_card"
    | "debit_card"
    | "pix"
    | "boleto"
    | "paypal"
    | "apple_pay"
    | "google_pay";
  name: string;
  description: string;
  isActive: boolean;
  processingFee: number;
  minAmount?: number;
  maxAmount?: number;
  supportedCurrencies: string[];
  estimatedProcessingTime: string; // "instant", "1-3 days", etc.
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;

  // Valores
  amount: number;
  currency: string;
  processingFee: number;
  netAmount: number;

  // Status
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded"
    | "partially_refunded";

  // IDs externos
  externalTransactionId?: string;
  gatewayTransactionId?: string;
  authorizationCode?: string;

  // Detalhes específicos do método
  cardDetails?: {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    holderName: string;
  };

  pixDetails?: {
    qrCode?: string;
    pixKey?: string;
    expiresAt?: Date;
  };

  boletoDetails?: {
    barcodeNumber?: string;
    digitableLine?: string;
    expiresAt?: Date;
    bankName?: string;
  };

  // Datas
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  confirmedAt?: Date;

  // Outros
  failureReason?: string;
  refundReason?: string;
  notes?: string;
}

export interface PaymentRefund {
  id: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: "pending" | "processing" | "completed" | "failed";
  externalRefundId?: string;
  createdAt: Date;
  processedAt?: Date;
  notes?: string;
}

export interface PaymentFilter {
  status?: PaymentTransaction["status"][];
  paymentMethodId?: string;
  orderId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: "amount" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaymentSearchResult {
  transactions: PaymentTransaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreatePaymentData {
  orderId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;

  // Dados específicos do método
  cardData?: {
    number: string;
    holderName: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  };

  pixData?: {
    pixKey?: string;
  };

  // Outros
  saveCard?: boolean;
  installments?: number;
}

export interface PaymentGatewayResponse {
  success: boolean;
  transactionId: string;
  externalTransactionId?: string;
  status: PaymentTransaction["status"];
  message?: string;
  authorizationCode?: string;

  // Para PIX
  qrCode?: string;

  // Para Boleto
  barcodeNumber?: string;
  digitableLine?: string;

  // URLs
  paymentUrl?: string;
  redirectUrl?: string;
}
