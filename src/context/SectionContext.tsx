"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardSection = "main" | "products" | "orders" | "users" | "schedule";

interface SectionContextType {
  currentSection: DashboardSection;
  setCurrentSection: (section: DashboardSection) => void;
  getSectionLabel: (section: DashboardSection) => string;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] =
    useState<DashboardSection>("main");

  const getSectionLabel = (section: DashboardSection): string => {
    switch (section) {
      case "main":
        return "Dashboard";
      case "products":
        return "Produtos";
      case "orders":
        return "Pedidos";
      case "users":
        return "Usuários";
      case "schedule":
        return "Agenda";
      default:
        return "Dashboard";
    }
  };

  return (
    <SectionContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        getSectionLabel,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSection must be used within a SectionProvider");
  }
  return context;
}
