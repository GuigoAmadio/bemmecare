// Tipos de API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

// Tipos de Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  clientId: string;
  client?: {
    id: string;
    name: string;
    status: string;
  };
}

// Tipos de Login
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refresh_token?: string;
  client_id: string;
}

// Tipos de Dashboard
export interface DashboardStats {
  mainMetrics: {
    websiteVisits: number;
    totalSalesAmount: number;
    totalProductsSold: number;
    monthlyRevenue: number;
  };
  topSellingProducts: TopSellingProduct[];
  today: {
    count: number;
    revenue: number;
  };
  month: {
    count: number;
    revenue: number;
  };
  todayAppointments: TodayAppointment[];
  overview: {
    totalProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
  };
}

export interface TopSellingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantitySold: number;
  totalRevenue: number;
  image?: string;
}

export interface TodayAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    name: string;
    price: number;
  };
  user: {
    name: string;
    email: string;
  };
}

// Tipos de Tenant
export interface TenantConfig {
  clientId: string;
  token?: string;
}

// Tipos de autenticação
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message: string;
}

// Tipos de produtos
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: string;
  category?: Category;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  salesStats?: {
    totalSold: number;
    totalRevenue: number;
    lastSaleDate?: string;
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProductStats {
  totalProducts: number;
  totalSoldValue: number;
  totalSoldQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  averagePrice: number;
  monthlyRevenue: number;
  metrics: {
    productsInStock: number;
    inventoryValue: number;
    topSellingCategory: string;
  };
}

// Tipos de agendamentos
export interface Appointment {
  id: string;
  title?: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  description?: string;
  service?: {
    id: string;
    name: string;
    price: number;
    category?: Category;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    appointment: Appointment;
  };
}

export interface AppointmentFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

export interface AppointmentStats {
  today: {
    count: number;
    revenue: number;
  };
  month: {
    count: number;
    revenue: number;
  };
  overall: {
    totalCompleted: number;
    averageDuration: number;
  };
}

export interface AvailableSlot {
  start: string;
  end: string;
  time: string;
}

// Tipos de categorias
export interface Category {
  id: string;
  name: string;
  color?: string;
  type?: string;
  description?: string;
}

// Tipos de paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Tipos para formulários
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: string;
  images?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id?: string;
}

export interface CreateAppointmentData {
  startTime: string;
  endTime: string;
  serviceId: string;
  userId: string;
  description?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  status?: string;
}

export interface CreateCategoryData {
  name: string;
  color?: string;
  type?: string;
  description?: string;
}

// Tipos específicos para componentes
export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export interface CalendarViewProps {
  appointments: Appointment[];
  onEventClick?: (appointment: Appointment) => void;
  onSlotClick?: (date: Date, time: string) => void;
  onEventDrop?: (appointment: Appointment, newStart: Date) => void;
}

export interface ProductTableProps {
  products: Product[];
  pagination?: PaginationMeta;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onStockUpdate?: (productId: string, newStock: number) => void;
}

// Enums para status
export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
