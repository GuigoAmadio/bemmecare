export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  trackingUrl: string;
  isActive: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  carrier: ShippingCarrier;
  price: number;
  estimatedDays: number;
  minWeight?: number;
  maxWeight?: number;
  isActive: boolean;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  date: Date;
  time: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: ShippingCarrier;
  method: ShippingMethod;
  status:
    | "pending"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned";

  // Endereços
  originAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  destinationAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Detalhes do pacote
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  // Custos
  shippingCost: number;
  insuranceValue?: number;

  // Datas
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;

  // Rastreamento
  trackingEvents: TrackingEvent[];
  currentLocation?: string;

  // Outros
  notes?: string;
  signature?: string;
  deliveryInstructions?: string;
}

export interface ShipmentFilter {
  status?: Shipment["status"][];
  carrierId?: string;
  orderId?: string;
  trackingNumber?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "trackingNumber" | "createdAt" | "estimatedDelivery" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ShipmentSearchResult {
  shipments: Shipment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateShipmentData {
  orderId: string;
  carrierId: string;
  methodId: string;
  destinationAddress: Shipment["destinationAddress"];
  weight: number;
  dimensions: Shipment["dimensions"];
  insuranceValue?: number;
  deliveryInstructions?: string;
}

export interface ShippingQuote {
  carrierId: string;
  methodId: string;
  carrierName: string;
  methodName: string;
  price: number;
  estimatedDays: number;
  description: string;
}
