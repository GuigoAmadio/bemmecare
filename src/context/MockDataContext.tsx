"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Schedule } from "@/types/schedule";
import { useMockSchedules } from "@/hooks/useMockSchedules";

interface MockDataContextType {
  schedules: Schedule[];
  statistics: any;
  loading: boolean;
  error: string | null;
  isMockDataActive: boolean;
  loadMockData: () => void;
  addMockSchedule: (
    schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateMockSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteMockSchedule: (id: string) => void;
  clearMockData: () => void;
  exportMockData: () => void;
  getUpcomingSchedules: (days?: number) => Schedule[];
  getOverdueSchedules: () => Schedule[];
  getTodaySchedules: () => Schedule[];
}

const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined
);

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}

interface MockDataProviderProps {
  children: ReactNode;
}

export function MockDataProvider({ children }: MockDataProviderProps) {
  const {
    schedules,
    statistics,
    loading,
    error,
    addMockSchedule,
    updateMockSchedule,
    deleteMockSchedule,
    reload,
    getUpcomingSchedules,
    getOverdueSchedules,
    getTodaySchedules,
  } = useMockSchedules();
  const [isMockDataActive, setIsMockDataActive] = useState(true);

  console.log("SCHEDULES VOLTADOS DA FUNCAO: ", schedules);
  // Verificar se há dados mockup salvos no localStorage
  useEffect(() => {
    const savedMockData = localStorage.getItem("bemmecare-mock-data");
    console.log("asss passando mas nao tem.");
    if (savedMockData) {
      try {
        console.log("DaAAADOS mockiup: ", savedMockData);
        const parsedData = JSON.parse(savedMockData);
        if (parsedData.schedules && parsedData.schedules.length > 0) {
          setIsMockDataActive(true);
        }
      } catch (error) {
        console.error("Erro ao carregar dados mockup salvos:", error);
      }
    }
  }, []);

  // Salvar dados mockup no localStorage sempre que mudarem
  useEffect(() => {
    if (schedules.length > 0 && isMockDataActive) {
      localStorage.setItem(
        "bemmecare-mock-data",
        JSON.stringify({
          schedules,
          statistics,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [schedules, statistics, isMockDataActive]);

  const loadMockData = () => {
    setIsMockDataActive(true);
    reload();
  };

  const clearMockData = () => {
    setIsMockDataActive(false);
    localStorage.removeItem("bemmecare-mock-data");
    // Recarregar dados originais
    reload();
  };

  const exportMockData = () => {
    const dataStr = JSON.stringify({ schedules, statistics }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mock-schedules-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const value: MockDataContextType = {
    schedules,
    statistics,
    loading,
    error,
    isMockDataActive,
    loadMockData,
    addMockSchedule,
    updateMockSchedule,
    deleteMockSchedule,
    clearMockData,
    exportMockData,
    getUpcomingSchedules,
    getOverdueSchedules,
    getTodaySchedules,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}
