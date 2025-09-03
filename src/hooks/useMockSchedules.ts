import { useState, useEffect } from "react";
import { Schedule } from "@/types/schedule";
import mockData from "@/data/mockSchedules.json";

interface MockDataResponse {
  schedules: Schedule[];
  statistics: {
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    upcoming: number;
    overdue: number;
    completedThisWeek: number;
    publicTasks: number;
    privateTasks: number;
    recurringTasks: number;
    withReminders: number;
    withAttachments: number;
  };
  metadata: {
    generatedAt: string;
    version: string;
    description: string;
    totalTasks: number;
    dateRange: {
      start: string;
      end: string;
    };
    users: string[];
    employees: string[];
    clients: string[];
  };
}

export function useMockSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [statistics, setStatistics] = useState<
    MockDataResponse["statistics"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... existing code ...

  // Monitorar mudanças no estado schedules
  useEffect(() => {
    console.log(
      "�� useEffect detectou mudança em schedules:",
      schedules.length
    );
    if (schedules.length > 0) {
      console.log("✅ Primeiro schedule no estado:", schedules[0]?.title);
    }
  }, [schedules]);

  // ... existing code ...

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Iniciando carregamento de dados mockup...");

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Usar 'unknown' primeiro para evitar erro de tipo
      const rawData = mockData as unknown;
      console.log("📊 Dados brutos carregados:", rawData);

      // Validar e converter os dados
      const data = rawData as MockDataResponse;
      console.log("✅ Dados convertidos para MockDataResponse: ", data);
      // Converter datas string para objetos Date quando necessário
      const processedSchedules = data.schedules.map((schedule) => ({
        ...schedule,
        // Garantir que as datas estão no formato correto
        date: schedule.date,
        startTime: schedule.startTime || undefined,
        endTime: schedule.endTime || undefined,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
        completedAt: schedule.completedAt || undefined,
      }));

      setSchedules(processedSchedules);

      // Congela o código por 2 segundos para dar tempo de refletir as mudanças

      setStatistics(data.statistics);
    } catch (err) {
      setError("Erro ao carregar dados mockup");
      console.error("Erro ao carregar mock data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMockSchedule = (
    newSchedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">
  ) => {
    const schedule: Schedule = {
      ...newSchedule,
      id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSchedules((prev) => [...prev, schedule]);
    return schedule;
  };

  const updateMockSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id
          ? { ...schedule, ...updates, updatedAt: new Date().toISOString() }
          : schedule
      )
    );
  };

  const deleteMockSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const getSchedulesByDateRange = (startDate: string, endDate: string) => {
    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return scheduleDate >= start && scheduleDate <= end;
    });
  };

  const getSchedulesByStatus = (status: string) => {
    return schedules.filter((schedule) => schedule.status === status);
  };

  const getSchedulesByCategory = (category: string) => {
    return schedules.filter((schedule) => schedule.category === category);
  };

  const searchSchedules = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return schedules.filter(
      (schedule) =>
        schedule.title.toLowerCase().includes(term) ||
        schedule.description?.toLowerCase().includes(term)
    );
  };

  const getUpcomingSchedules = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= now && scheduleDate <= futureDate;
    });
  };

  const getOverdueSchedules = () => {
    const now = new Date();
    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate < now &&
        schedule.status !== "COMPLETED" &&
        schedule.status !== "CANCELLED"
      );
    });
  };

  const getTodaySchedules = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= today && scheduleDate < tomorrow;
    });
  };

  return {
    schedules,
    statistics,
    loading,
    error,
    // CRUD operations
    addMockSchedule,
    updateMockSchedule,
    deleteMockSchedule,
    // Filters and queries
    getSchedulesByDateRange,
    getSchedulesByStatus,
    getSchedulesByCategory,
    searchSchedules,
    getUpcomingSchedules,
    getOverdueSchedules,
    getTodaySchedules,
    // Utility
    reload: loadMockData,
  };
}

// Função para gerar dados mockup adicionais
export function generateMockSchedule(
  overrides: Partial<Schedule> = {}
): Omit<Schedule, "id" | "createdAt" | "updatedAt"> {
  const titles = [
    "Reunião de Equipe",
    "Consulta Médica",
    "Apresentação do Projeto",
    "Treinamento Online",
    "Call com Cliente",
    "Workshop de UX",
    "Code Review",
    "Planejamento Sprint",
    "Dentista",
    "Academia",
    "Compras do Mercado",
    "Aniversário",
    "Viagem de Negócios",
    "Backup de Dados",
    "Renovar Documentos",
  ];

  const descriptions = [
    "Reunião semanal para alinhamento da equipe",
    "Consulta de rotina com especialista",
    "Apresentação dos resultados do trimestre",
    "Curso online sobre novas tecnologias",
    "Reunião com cliente para feedback",
    "Workshop sobre experiência do usuário",
    "Revisão de código da sprint atual",
    "Planejamento das atividades da próxima sprint",
    "Limpeza e avaliação dental",
    "Treino de força e cardio",
    "Compras mensais do supermercado",
    "Festa de aniversário",
    "Viagem para reuniões presenciais",
    "Backup semanal dos sistemas",
    "Renovação de documentos importantes",
  ];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDescription =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  // Gerar data aleatória nos próximos 30 dias
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));

  const categories = [
    "WORK",
    "PERSONAL",
    "MEETING",
    "APPOINTMENT",
    "REMINDER",
    "OTHER",
  ];
  const statuses = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "POSTPONED",
  ];
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  return {
    clientId: `client-${Math.floor(Math.random() * 3) + 1}`,
    userId: `user-${Math.floor(Math.random() * 2) + 1}`,
    employeeId:
      Math.random() > 0.3
        ? `emp-${Math.floor(Math.random() * 3) + 1}`
        : undefined,
    date: futureDate.toISOString().split("T")[0],
    title: randomTitle,
    description: randomDescription,
    tasks: [],
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
    startTime:
      Math.random() > 0.3
        ? new Date(
            futureDate.getTime() + Math.random() * 8 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    endTime: undefined,
    allDay: Math.random() > 0.7,
    isRecurring: Math.random() > 0.8,
    recurringPattern: undefined,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    category: categories[Math.floor(Math.random() * categories.length)] as any,
    reminders: [],
    attachments: [],
    isPublic: Math.random() > 0.5,
    completedAt: undefined,
    ...overrides,
  };
}
