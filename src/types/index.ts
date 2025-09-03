// Centralized export for all types
export * from "./products";
export * from "./cart";
export * from "./auth";
export * from "./api";
export * from "./user";
export * from "./orders";
export * from "./shipments";
export * from "./categories";
export * from "./payments";
export * from "./schedule";

// Common utility types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Theme and UI Types
export type Theme = "light" | "dark" | "system";
export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type Variant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link";

// Notification Types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}
