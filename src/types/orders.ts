import { Product, ProductVariant } from "./products";
import { User } from "./user";

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariants?: Record<string, ProductVariant>;
}

export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  instructions?: string;
}

export interface PaymentInfo {
  method: "credit_card" | "debit_card" | "pix" | "boleto" | "paypal";
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentDate?: Date;
  amount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";

  // Valores
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;

  // Endereços
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;

  // Pagamento
  paymentInfo: PaymentInfo;

  // Envio
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;

  // Datas
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;

  // Outros
  notes?: string;
  couponCode?: string;
}

export interface OrderFilter {
  status?: Order["status"][];
  paymentStatus?: Order["paymentStatus"][];
  userId?: string;
  orderNumber?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minTotal?: number;
  maxTotal?: number;
  sortBy?: "orderNumber" | "total" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface OrderSearchResult {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    selectedVariants?: Record<string, ProductVariant>;
  }>;
  shippingAddress: Omit<ShippingAddress, "id">;
  billingAddress?: Omit<ShippingAddress, "id">;
  paymentMethod: PaymentInfo["method"];
  shippingMethod?: string;
  couponCode?: string;
  notes?: string;
}

export interface OrderStatusUpdate {
  status: Order["status"];
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}
