// Enums baseados no backend
export enum ScheduleStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  POSTPONED = "POSTPONED",
}

export enum SchedulePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum ScheduleCategory {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  MEETING = "MEETING",
  APPOINTMENT = "APPOINTMENT",
  REMINDER = "REMINDER",
  OTHER = "OTHER",
}

// Interfaces auxiliares
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: SchedulePriority;
  dueTime?: string;
}

export interface Reminder {
  id?: string;
  type: "email" | "notification" | "sms";
  minutes: number; // Compatível com dados mockup
  minutesBefore?: number; // Mantido para compatibilidade
  enabled?: boolean;
}

export interface RecurringPattern {
  type: "daily" | "weekly" | "monthly" | "yearly"; // Compatível com dados mockup
  frequency?: "daily" | "weekly" | "monthly" | "yearly"; // Mantido para compatibilidade
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number; // Para padrões mensais
  endDate?: string;
  occurrences?: number;
}

// Interface principal do Schedule (baseada no Prisma)
export interface Schedule {
  id: string;
  clientId: string;
  userId: string;
  employeeId?: string;
  date: string; // DateTime do backend vira string no frontend
  title: string;
  description?: string;
  tasks: Task[]; // JSON no backend vira array tipado no frontend
  status: ScheduleStatus;
  priority: SchedulePriority;
  startTime?: string; // DateTime opcional
  endTime?: string; // DateTime opcional
  allDay: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern; // JSON tipado
  color?: string;
  category: ScheduleCategory;
  reminders: Reminder[]; // JSON no backend vira array tipado
  attachments: string[]; // Array de URLs
  isPublic: boolean;
  completedAt?: string; // DateTime opcional
  createdAt: string;
  updatedAt: string;
}

// DTOs para criação e atualização
export interface CreateScheduleInput {
  title: string;
  description?: string;
  date: string;
  tasks?: Task[];
  status?: ScheduleStatus;
  priority?: SchedulePriority;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  color?: string;
  category?: ScheduleCategory;
  reminders?: Reminder[];
  attachments?: string[];
  isPublic?: boolean;
  employeeId?: string;
}

export interface UpdateScheduleInput extends Partial<CreateScheduleInput> {}

// Interface para filtros de busca
export interface GetSchedulesFilters {
  startDate?: string;
  endDate?: string;
  date?: string;
  status?: ScheduleStatus;
  category?: ScheduleCategory;
  priority?: SchedulePriority;
  employeeId?: string;
  publicOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interface para resposta da API
export interface ScheduleResponse {
  success: boolean;
  data?: Schedule;
  message?: string;
}

export interface SchedulesListResponse {
  success: boolean;
  data?: Schedule[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

// Interface para estatísticas
export interface ScheduleStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  postponed: number;
  todayTotal: number;
  upcomingTotal: number;
  overdue: number;
}

export interface ScheduleStatsResponse {
  success: boolean;
  data?: ScheduleStats;
  message?: string;
}

// Utilitários para formatação
export const getScheduleStatusLabel = (status: ScheduleStatus): string => {
  switch (status) {
    case ScheduleStatus.PENDING:
      return "Pendente";
    case ScheduleStatus.IN_PROGRESS:
      return "Em Andamento";
    case ScheduleStatus.COMPLETED:
      return "Concluído";
    case ScheduleStatus.CANCELLED:
      return "Cancelado";
    case ScheduleStatus.POSTPONED:
      return "Adiado";
    default:
      return status;
  }
};

export const getSchedulePriorityLabel = (
  priority: SchedulePriority
): string => {
  switch (priority) {
    case SchedulePriority.LOW:
      return "Baixa";
    case SchedulePriority.MEDIUM:
      return "Média";
    case SchedulePriority.HIGH:
      return "Alta";
    case SchedulePriority.URGENT:
      return "Urgente";
    default:
      return priority;
  }
};

export const getScheduleCategoryLabel = (
  category: ScheduleCategory
): string => {
  switch (category) {
    case ScheduleCategory.WORK:
      return "Trabalho";
    case ScheduleCategory.PERSONAL:
      return "Pessoal";
    case ScheduleCategory.MEETING:
      return "Reunião";
    case ScheduleCategory.APPOINTMENT:
      return "Consulta";
    case ScheduleCategory.REMINDER:
      return "Lembrete";
    case ScheduleCategory.OTHER:
      return "Outro";
    default:
      return category;
  }
};

// Cores padrão para categorias
export const getScheduleCategoryColor = (
  category: ScheduleCategory
): string => {
  switch (category) {
    case ScheduleCategory.WORK:
      return "#3B82F6"; // blue-500
    case ScheduleCategory.PERSONAL:
      return "#10B981"; // emerald-500
    case ScheduleCategory.MEETING:
      return "#8B5CF6"; // violet-500
    case ScheduleCategory.APPOINTMENT:
      return "#F59E0B"; // amber-500
    case ScheduleCategory.REMINDER:
      return "#EF4444"; // red-500
    case ScheduleCategory.OTHER:
      return "#6B7280"; // gray-500
    default:
      return "#6B7280";
  }
};

// Cores para prioridades
export const getSchedulePriorityColor = (
  priority: SchedulePriority
): string => {
  switch (priority) {
    case SchedulePriority.LOW:
      return "#10B981"; // emerald-500
    case SchedulePriority.MEDIUM:
      return "#F59E0B"; // amber-500
    case SchedulePriority.HIGH:
      return "#EF4444"; // red-500
    case SchedulePriority.URGENT:
      return "#DC2626"; // red-600
    default:
      return "#6B7280";
  }
};
