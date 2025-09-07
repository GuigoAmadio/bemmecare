"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  Schedule,
  CreateScheduleInput,
  UpdateScheduleInput,
  ScheduleStatus,
} from "@/types/schedule";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  updateScheduleStatus,
} from "@/actions/schedules";

interface ScheduleContextType {
  // Estado
  schedules: Schedule[];
  loading: boolean;
  error: string | null;

  // Ações CRUD
  createSchedule: (data: CreateScheduleInput) => Promise<boolean>;
  updateSchedule: (id: string, data: UpdateScheduleInput) => Promise<boolean>;
  deleteSchedule: (id: string) => Promise<boolean>;
  updateScheduleStatus: (
    id: string,
    status: ScheduleStatus
  ) => Promise<boolean>;

  // Utilitários
  refreshSchedules: () => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
  getSchedulesByDate: (date: Date) => Schedule[];
  getSchedulesByStatus: (status: ScheduleStatus) => Schedule[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export function useScheduleContext() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error(
      "useScheduleContext must be used within a ScheduleProvider"
    );
  }
  return context;
}

interface ScheduleProviderProps {
  children: ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar schedules iniciais
  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getSchedules();

      if (result) {
        setSchedules(result);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar agenda");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // Criar schedule
  const handleCreateSchedule = useCallback(
    async (data: CreateScheduleInput): Promise<boolean> => {
      try {
        setError(null);

        const result = await createSchedule(data);

        if (result.success && result.data) {
          setSchedules((prev) => [...prev, result.data as Schedule]);
          return true;
        } else {
          setError(result.message || "Erro ao criar agenda");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar agenda");
        return false;
      }
    },
    []
  );

  // Atualizar schedule
  const handleUpdateSchedule = useCallback(
    async (id: string, data: UpdateScheduleInput): Promise<boolean> => {
      try {
        setError(null);

        const result = await updateSchedule(id, data);

        if (result.success && result.data) {
          setSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === id ? (result.data as Schedule) : schedule
            )
          );
          return true;
        } else {
          setError(result.message || "Erro ao atualizar agenda");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao atualizar agenda"
        );
        return false;
      }
    },
    []
  );

  // Deletar schedule
  const handleDeleteSchedule = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const result = await deleteSchedule(id);

        if (result.success) {
          setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
          return true;
        } else {
          setError(result.message || "Erro ao deletar agenda");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao deletar agenda");
        return false;
      }
    },
    []
  );

  // Atualizar status
  const handleUpdateScheduleStatus = useCallback(
    async (id: string, status: ScheduleStatus): Promise<boolean> => {
      try {
        setError(null);

        const result = await updateScheduleStatus(id, status);

        if (result.success && result.data) {
          setSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === id
                ? { ...schedule, ...(result.data as Schedule) }
                : schedule
            )
          );
          return true;
        } else {
          setError(result.message || "Erro ao atualizar status");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao atualizar status"
        );
        return false;
      }
    },
    []
  );

  // Utilitários
  const getScheduleById = useCallback(
    (id: string): Schedule | undefined => {
      return schedules.find((schedule) => schedule.id === id);
    },
    [schedules]
  );

  const getSchedulesByDate = useCallback(
    (date: Date): Schedule[] => {
      const dateStr = date.toISOString().split("T")[0];
      return schedules.filter((schedule) => schedule.date.startsWith(dateStr));
    },
    [schedules]
  );

  const getSchedulesByStatus = useCallback(
    (status: ScheduleStatus): Schedule[] => {
      return schedules.filter((schedule) => schedule.status === status);
    },
    [schedules]
  );

  const refreshSchedules = useCallback(async () => {
    await loadSchedules();
  }, [loadSchedules]);

  const value: ScheduleContextType = {
    // Estado
    schedules,
    loading,
    error,

    // Ações CRUD
    createSchedule: handleCreateSchedule,
    updateSchedule: handleUpdateSchedule,
    deleteSchedule: handleDeleteSchedule,
    updateScheduleStatus: handleUpdateScheduleStatus,

    // Utilitários
    refreshSchedules,
    getScheduleById,
    getSchedulesByDate,
    getSchedulesByStatus,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}
