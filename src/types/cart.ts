import { Product, ProductVariant } from "./products";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, ProductVariant>;
  addedAt: Date;
}

export interface Cart {
  id?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  weight: number;
  couponCode?: string;
  updatedAt: Date;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  carrier: string;
  trackingAvailable: boolean;
}

export interface CartActions {
  addItem: (
    product: Product,
    quantity?: number,
    variants?: Record<string, ProductVariant>
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  calculateShipping: (address: any) => Promise<ShippingOption[]>;
}
