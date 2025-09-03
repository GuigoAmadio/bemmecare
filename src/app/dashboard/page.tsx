"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSection } from "@/context/SectionContext";
import {
  Package,
  ShoppingCart,
  Users,
  Calendar,
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
      icon: <Package className="h-8 w-8" />,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      hoverColor:
        "hover:from-blue-200 hover:to-blue-300 hover:shadow-blue-200/50",
    },
    {
      id: "orders",
      title: "Pedidos",
      description: "Acompanhar vendas e entregas",
      icon: <ShoppingCart className="h-8 w-8" />,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-200",
      hoverColor:
        "hover:from-emerald-200 hover:to-emerald-300 hover:shadow-emerald-200/50",
    },
    {
      id: "users",
      title: "Usuários",
      description: "Gerenciar clientes e funcionários",
      icon: <Users className="h-8 w-8" />,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      hoverColor:
        "hover:from-purple-200 hover:to-purple-300 hover:shadow-purple-200/50",
    },
    {
      id: "schedule",
      title: "Agenda",
      description: "Organizar compromissos e eventos",
      icon: <Calendar className="h-8 w-8" />,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-100 to-amber-200",
      hoverColor:
        "hover:from-amber-200 hover:to-amber-300 hover:shadow-amber-200/50",
    },
  ];

  const renderMainDashboard = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      {/* Welcome Message */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary">
          Bem-vinda
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {user?.name?.split(" ")[0] || "Usuário"}!
        </h2>
        <p className="text-xl text-text-muted mt-6 max-w-2xl">
          Escolha uma das opções abaixo para gerenciar sua plataforma
        </p>
      </div>

      {/* Dashboard Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {dashboardOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setCurrentSection(option.id)}
            className={`group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 ${option.hoverColor} transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
          >
            {/* Icon Circle */}
            <div
              className={`w-20 h-20 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <div className={option.color}>{option.icon}</div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-text-primary group-hover:text-text-primary/90">
                {option.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {option.description}
              </p>
            </div>

            {/* Arrow Icon */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className={`h-5 w-5 ${option.color}`} />
            </div>

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-12">
        <div className="bg-gradient-to-br from-blue-100/80 to-blue-200/80 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-200/50 shadow-lg hover:shadow-xl transition-all">
          <div className="text-2xl font-bold text-blue-700">142</div>
          <div className="text-sm text-blue-600">Produtos Ativos</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-100/80 to-emerald-200/80 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all">
          <div className="text-2xl font-bold text-emerald-700">28</div>
          <div className="text-sm text-emerald-600">Pedidos Hoje</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100/80 to-purple-200/80 backdrop-blur-sm rounded-xl p-6 text-center border border-purple-200/50 shadow-lg hover:shadow-xl transition-all">
          <div className="text-2xl font-bold text-purple-700">1.2k</div>
          <div className="text-sm text-purple-600">Usuários Ativos</div>
        </div>
        <div className="bg-gradient-to-br from-amber-100/80 to-amber-200/80 backdrop-blur-sm rounded-xl p-6 text-center border border-amber-200/50 shadow-lg hover:shadow-xl transition-all">
          <div className="text-2xl font-bold text-amber-700">5</div>
          <div className="text-sm text-amber-600">Compromissos</div>
        </div>
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

  return <div className="min-h-screen">{renderSection()}</div>;
}
