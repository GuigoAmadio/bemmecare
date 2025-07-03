"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/actions/dashboard";
import type { DashboardStats, TodayAppointment } from "@/types";

// Componente do Card de Métrica
function MetricCard({
  title,
  value,
  subtitle,
  onClick,
  trend,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
  trend?: { value: number; isPositive: boolean };
  icon?: React.ReactNode;
}) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (title.includes("visitas") || title.includes("produtos")) {
        return (val || 0).toLocaleString("pt-BR");
      }
      if (title.includes("vendido") || title.includes("receita")) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(val || 0);
      }
      return (val || 0).toLocaleString("pt-BR");
    }
    return val || "0";
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
        onClick ? "cursor-pointer hover:scale-[1.02]" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-indigo-600">{icon}</div>}
      </div>

      <div className="flex items-baseline space-x-2">
        <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

// Componente da Lista de Produtos Mais Vendidos
function TopSellingProductsList({
  products,
}: {
  products: DashboardStats["topSellingProducts"];
}) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Produtos Mais Vendidos
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum produto vendido ainda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Produtos Mais Vendidos
        </h3>
        <button
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          onClick={() => (window.location.href = "/dashboard/produtos")}
        >
          Ver todos
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-700">
                #{index + 1}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {product.quantitySold} vendidos
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente das Consultas de Hoje
function TodayConsultations({
  today,
  todayAppointments,
}: {
  today: number;
  todayAppointments: TodayAppointment[];
}) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmado";
      case "SCHEDULED":
        return "Agendado";
      case "COMPLETED":
        return "Concluído";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (!todayAppointments) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Consultas Hoje
            </h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">agendamentos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card de Consultas Hoje */}
      <div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
        onClick={() => (window.location.href = "/dashboard/agendamentos")}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Consultas Hoje</h3>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{today || 0}</p>
        <p className="text-sm text-gray-500 mt-1">agendamentos</p>
      </div>

      {/* Lista de Horários */}
      <h4 className="text-sm font-medium text-gray-900 mb-4">
        Horários de Hoje
      </h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {todayAppointments.length > 0 ? (
          todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatTime(appointment.startTime)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {appointment.service?.name || "Serviço não informado"}
                </p>
                <p className="text-xs text-gray-500">
                  {appointment.user?.name || "Cliente não informado"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(appointment.service?.price || 0)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              Nenhum agendamento para hoje
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Principal do Dashboard
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setError(null);
        const result = await getDashboardStats();
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          setError(result.message || "Erro ao carregar dados");
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        setError("Erro ao carregar estatísticas do dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Valores padrão caso stats ou suas propriedades sejam undefined
  const safeStats = {
    mainMetrics: {
      websiteVisits: stats?.mainMetrics?.websiteVisits || 2,
      totalSalesAmount: stats?.mainMetrics?.totalSalesAmount || 0,
      totalProductsSold: stats?.mainMetrics?.totalProductsSold || 0,
      monthlyRevenue: stats?.mainMetrics?.monthlyRevenue || 0,
    },
    topSellingProducts: stats?.topSellingProducts || [],
    today: {
      count: stats?.today?.count || 0,
      revenue: stats?.today?.revenue || 0,
    },
    todayAppointments: stats?.todayAppointments || [],
    overview: {
      totalProducts: stats?.overview?.totalProducts || 0,
      lowStockProducts: stats?.overview?.lowStockProducts || 0,
      pendingOrders: stats?.overview?.pendingOrders || 0,
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Visitas no Site"
          value={safeStats.mainMetrics.websiteVisits}
          subtitle="visitantes únicos"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
        />

        <MetricCard
          title="Valor Total Vendido"
          value={safeStats.mainMetrics.totalSalesAmount}
          subtitle="em vendas"
          onClick={() => (window.location.href = "/dashboard/vendas")}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          }
        />

        <MetricCard
          title="Produtos Vendidos"
          value={safeStats.mainMetrics.totalProductsSold}
          subtitle="unidades"
          onClick={() => (window.location.href = "/dashboard/produtos")}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        <MetricCard
          title="Receita Mensal"
          value={safeStats.mainMetrics.monthlyRevenue}
          subtitle="este mês"
          trend={{ value: 8.5, isPositive: true }}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />
      </div>

      {/* Seção Principal - Produtos e Consultas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Produtos Mais Vendidos - 2/3 da largura */}
        <div className="xl:col-span-2">
          <TopSellingProductsList products={safeStats.topSellingProducts} />
        </div>

        {/* Consultas - 1/3 da largura */}
        <div className="xl:col-span-1">
          <TodayConsultations
            today={safeStats.today.count}
            todayAppointments={safeStats.todayAppointments}
          />
        </div>
      </div>
    </div>
  );
}
