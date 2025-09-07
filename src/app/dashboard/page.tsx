"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSection } from "@/context/SectionContext";
import {
  Box,
  ShoppingBag,
  UserCheck,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

// Import das seções do dashboard
import ProductsSection from "@/components/dashboard/sections/ProductsSection";
import OrdersSection from "@/components/dashboard/sections/OrdersSection";
import UsersSection from "@/components/dashboard/sections/UsersSection";
import ScheduleSection from "@/components/dashboard/sections/ScheduleSection";

type DashboardSection = "main" | "products" | "orders" | "users" | "schedule";

interface DashboardOption {
  id: DashboardSection;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentSection, setCurrentSection } = useSection();

  const dashboardOptions: DashboardOption[] = [
    {
      id: "products",
      title: "Produtos",
      description: "Gerenciar catálogo e estoque",
      icon: <Box className="h-8 w-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-300",
      hoverColor: "hover:bg-blue-400",
    },
    {
      id: "orders",
      title: "Pedidos",
      description: "Acompanhar vendas e entregas",
      icon: <ShoppingBag className="h-8 w-8" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-300",
      hoverColor: "hover:bg-emerald-400",
    },
    {
      id: "users",
      title: "Usuários",
      description: "Gerenciar clientes e funcionários",
      icon: <UserCheck className="h-8 w-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-300",
      hoverColor: "hover:bg-purple-400",
    },
    {
      id: "schedule",
      title: "Agenda",
      description: "Organizar compromissos e eventos",
      icon: <CalendarDays className="h-8 w-8" />,
      color: "text-amber-600",
      bgColor: "bg-amber-300",
      hoverColor: "hover:bg-amber-400",
    },
  ];

  const renderMainDashboard = () => (
    <div className="flex flex-col items-center justify-center space-y-12 h-full">
      {/* Welcome Message */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary">
          Bem-vinda
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold text-black">
          {user?.name?.split(" ")[0] || "Usuário"}!
        </h2>
        <p className="text-xl text-text-muted mt-6 max-w-2xl">
          Escolha uma das opções abaixo para gerenciar sua plataforma
        </p>
      </div>

      {/* Dashboard Options Grid */}
      <div className="flex flex-wrap justify-center gap-20 w-full">
        {dashboardOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setCurrentSection(option.id)}
            className={`mt-10 flex flex-col items-center justify-center gap-1 p-4 w-40 h-40 ${
              option.bgColor
            } 
            backdrop-blur-sm rounded-full shadow-lg border
             border-white/20 ${option.hoverColor} transition-all
              duration-300 transform hover:scale-105 hover:shadow-2xl
              hover:cursor-pointer
              ${option.id === "orders" || option.id === "users" ? "mt-18" : ""}
            `}
          >
            <div className={`${option.color}`}>{option.icon}</div>

            {/* Content */}
            <h3 className={`text-xl font-bold ${option.color}`}>
              {option.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (currentSection) {
      case "products":
        return <ProductsSection onBack={() => setCurrentSection("main")} />;
      case "orders":
        return <OrdersSection onBack={() => setCurrentSection("main")} />;
      case "users":
        return <UsersSection onBack={() => setCurrentSection("main")} />;
      case "schedule":
        return <ScheduleSection onBack={() => setCurrentSection("main")} />;
      default:
        return renderMainDashboard();
    }
  };

  return <div className="h-full">{renderSection()}</div>;
}
