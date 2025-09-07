"use server";

import {
  serverGet,
  serverPost,
  serverDelete,
  serverPatch,
} from "@/lib/server-api";
import type {
  Shipment,
  ShipmentFilter,
  ShipmentSearchResult,
  CreateShipmentData,
  ShippingCarrier,
  ShippingMethod,
  ShippingQuote,
  TrackingEvent,
} from "@/types/shipments";
import { log, handleError, validateId, buildQueryParams } from "@/utils";

// ==================== CRUD BÁSICO ====================

export async function getShipments(): Promise<Shipment[] | undefined> {
  try {
    const response = await serverGet<Shipment[]>("/shipments");
    log("[getShipments] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShipments", error);
  }
}

export async function getShipmentById(
  id: string
): Promise<Shipment | undefined> {
  try {
    validateId(id, "ID do envio");
    const response = await serverGet<Shipment>(`/shipments/${id}`);
    log("[getShipmentById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShipmentById", error);
  }
}

export async function searchShipments(
  filters: ShipmentFilter
): Promise<ShipmentSearchResult | undefined> {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await serverGet<ShipmentSearchResult>(
      `/shipments/search?${queryParams.toString()}`
    );
    log("[searchShipments] Response:", response);
    return response.data;
  } catch (error) {
    handleError("searchShipments", error);
  }
}

export async function createShipment(
  shipmentData: CreateShipmentData
): Promise<Shipment | undefined> {
  try {
    validateId(shipmentData.orderId, "ID do pedido");
    validateId(shipmentData.carrierId, "ID da transportadora");
    validateId(shipmentData.methodId, "ID do método de envio");

    if (!shipmentData.destinationAddress) {
      throw new Error("Endereço de destino é obrigatório");
    }

    if (!shipmentData.weight || shipmentData.weight <= 0) {
      throw new Error("Peso deve ser maior que zero");
    }

    const response = await serverPost<Shipment>("/shipments", shipmentData);
    log("[createShipment] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createShipment", error);
  }
}

export async function updateShipment(
  id: string,
  shipmentData: Partial<Shipment>
): Promise<Shipment | undefined> {
  try {
    validateId(id, "ID do envio");
    const response = await serverPatch<Shipment>(
      `/shipments/${id}`,
      shipmentData
    );
    log("[updateShipment] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateShipment", error);
  }
}

export async function deleteShipment(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do envio");
    const response = await serverDelete<{ success: boolean }>(
      `/shipments/${id}`
    );
    log("[deleteShipment] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("deleteShipment", error);
    return false;
  }
}

// ==================== RASTREAMENTO ====================

export async function trackShipment(
  trackingNumber: string
): Promise<Shipment | undefined> {
  try {
    if (!trackingNumber?.trim()) {
      throw new Error("Código de rastreamento é obrigatório");
    }

    const response = await serverGet<Shipment>(
      `/shipments/track/${trackingNumber}`
    );
    log("[trackShipment] Response:", response);
    return response.data;
  } catch (error) {
    handleError("trackShipment", error);
  }
}

export async function getTrackingEvents(
  shipmentId: string
): Promise<TrackingEvent[] | undefined> {
  try {
    validateId(shipmentId, "ID do envio");
    const response = await serverGet<TrackingEvent[]>(
      `/shipments/${shipmentId}/tracking`
    );
    log("[getTrackingEvents] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getTrackingEvents", error);
  }
}

export async function addTrackingEvent(
  shipmentId: string,
  event: Omit<TrackingEvent, "id">
): Promise<TrackingEvent | undefined> {
  try {
    validateId(shipmentId, "ID do envio");

    if (!event.status?.trim()) {
      throw new Error("Status do evento é obrigatório");
    }

    if (!event.description?.trim()) {
      throw new Error("Descrição do evento é obrigatória");
    }

    const response = await serverPost<TrackingEvent>(
      `/shipments/${shipmentId}/tracking`,
      event
    );
    log("[addTrackingEvent] Response:", response);
    return response.data;
  } catch (error) {
    handleError("addTrackingEvent", error);
  }
}

export async function updateShipmentStatus(
  id: string,
  status: Shipment["status"],
  location?: string
): Promise<boolean> {
  try {
    validateId(id, "ID do envio");

    const response = await serverPatch<{ success: boolean }>(
      `/shipments/${id}/status`,
      { status, location }
    );
    log("[updateShipmentStatus] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("updateShipmentStatus", error);
    return false;
  }
}

// ==================== TRANSPORTADORAS E MÉTODOS ====================

export async function getCarriers(): Promise<ShippingCarrier[] | undefined> {
  try {
    const response = await serverGet<ShippingCarrier[]>("/carriers");
    log("[getCarriers] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCarriers", error);
  }
}

export async function getCarrierById(
  id: string
): Promise<ShippingCarrier | undefined> {
  try {
    validateId(id, "ID da transportadora");
    const response = await serverGet<ShippingCarrier>(`/carriers/${id}`);
    log("[getCarrierById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCarrierById", error);
  }
}

export async function getShippingMethods(
  carrierId?: string
): Promise<ShippingMethod[] | undefined> {
  try {
    const url = carrierId
      ? `/shipping-methods?carrierId=${carrierId}`
      : "/shipping-methods";
    const response = await serverGet<ShippingMethod[]>(url);
    log("[getShippingMethods] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShippingMethods", error);
  }
}

export async function getShippingMethodById(
  id: string
): Promise<ShippingMethod | undefined> {
  try {
    validateId(id, "ID do método de envio");
    const response = await serverGet<ShippingMethod>(`/shipping-methods/${id}`);
    log("[getShippingMethodById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShippingMethodById", error);
  }
}

// ==================== COTAÇÕES ====================

export async function getShippingQuotes(
  zipCode: string,
  weight: number,
  dimensions: { length: number; width: number; height: number }
): Promise<ShippingQuote[] | undefined> {
  try {
    if (!zipCode?.trim()) {
      throw new Error("CEP é obrigatório");
    }

    if (!weight || weight <= 0) {
      throw new Error("Peso deve ser maior que zero");
    }

    if (!dimensions.length || !dimensions.width || !dimensions.height) {
      throw new Error("Dimensões são obrigatórias");
    }

    const response = await serverPost<ShippingQuote[]>("/shipping-quotes", {
      zipCode,
      weight,
      dimensions,
    });
    log("[getShippingQuotes] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShippingQuotes", error);
  }
}

export async function calculateShipping(
  carrierId: string,
  methodId: string,
  zipCode: string,
  weight: number,
  dimensions: { length: number; width: number; height: number }
): Promise<ShippingQuote | undefined> {
  try {
    validateId(carrierId, "ID da transportadora");
    validateId(methodId, "ID do método");

    if (!zipCode?.trim()) {
      throw new Error("CEP é obrigatório");
    }

    const response = await serverPost<ShippingQuote>("/shipping-calculate", {
      carrierId,
      methodId,
      zipCode,
      weight,
      dimensions,
    });
    log("[calculateShipping] Response:", response);
    return response.data;
  } catch (error) {
    handleError("calculateShipping", error);
  }
}

// ==================== RELATÓRIOS E ESTATÍSTICAS ====================

export async function getShipmentsCount(): Promise<number | undefined> {
  try {
    const response = await serverGet<{ count: number }>("/shipments/count");
    log("[getShipmentsCount] Response:", response);
    return response.data?.count;
  } catch (error) {
    handleError("getShipmentsCount", error);
  }
}

export async function getShipmentsByOrder(
  orderId: string
): Promise<Shipment[] | undefined> {
  try {
    validateId(orderId, "ID do pedido");
    const response = await serverGet<Shipment[]>(`/shipments/order/${orderId}`);
    log("[getShipmentsByOrder] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShipmentsByOrder", error);
  }
}

export async function getShipmentsStats(): Promise<
  | {
      total: number;
      pending: number;
      inTransit: number;
      delivered: number;
      failed: number;
      averageDeliveryTime: number;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      total: number;
      pending: number;
      inTransit: number;
      delivered: number;
      failed: number;
      averageDeliveryTime: number;
    }>("/shipments/stats");
    log("[getShipmentsStats] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getShipmentsStats", error);
  }
}

// ==================== VALIDAÇÕES ====================

export async function validateZipCode(zipCode: string): Promise<{
  valid: boolean;
  message?: string;
  city?: string;
  state?: string;
}> {
  try {
    if (!zipCode?.trim()) {
      return { valid: false, message: "CEP é obrigatório" };
    }

    const response = await serverGet<{
      valid: boolean;
      message?: string;
      city?: string;
      state?: string;
    }>(`/validate-zipcode/${zipCode.replace(/\D/g, "")}`);
    log("[validateZipCode] Response:", response);
    return response.data || { valid: false, message: "CEP inválido" };
  } catch (error) {
    handleError("validateZipCode", error);
    return { valid: false, message: "Erro ao validar CEP" };
  }
}
