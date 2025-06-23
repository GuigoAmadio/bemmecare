"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Plus,
  Search,
  Calendar,
} from "lucide-react";

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados
  const sales = [
    {
      id: 1,
      customer: "Maria Silva",
      product: "Consulta Cardiologia",
      amount: 150.0,
      date: "2025-06-22",
      status: "pago",
      method: "cartão",
    },
    {
      id: 2,
      customer: "João Santos",
      product: "Vitamina D 2000UI",
      amount: 85.9,
      date: "2025-06-22",
      status: "pendente",
      method: "pix",
    },
    {
      id: 3,
      customer: "Ana Costa",
      product: "Exame de Sangue",
      amount: 200.0,
      date: "2025-06-21",
      status: "pago",
      method: "dinheiro",
    },
    {
      id: 4,
      customer: "Pedro Lima",
      product: "Consulta Dermatologia",
      amount: 180.0,
      date: "2025-06-21",
      status: "cancelado",
      method: "cartão",
    },
  ];

  const stats = {
    totalVendas: 52430.5,
    vendasHoje: 1250.0,
    ticketMedio: 125.75,
    conversao: 68.5,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-success-100 text-success-700";
      case "pendente":
        return "bg-warning-100 text-warning-700";
      case "cancelado":
        return "bg-error-100 text-error-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cartão":
        return <CreditCard className="h-4 w-4" />;
      case "pix":
        return <DollarSign className="h-4 w-4" />;
      case "dinheiro":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Vendas</h1>
          <p className="text-secondary-600 mt-2">
            Gerencie vendas e pagamentos
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Venda</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Total de Vendas
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                R${" "}
                {stats.totalVendas.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success mr-1" />
            <span className="text-success font-medium">+12.5%</span>
            <span className="text-secondary-500 ml-1">este mês</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Vendas Hoje
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                R${" "}
                {stats.vendasHoje.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-success-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-secondary-600">
              {sales.filter((s) => s.date === "2025-06-22").length} transações
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Ticket Médio
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                R${" "}
                {stats.ticketMedio.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-warning-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-warning" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success mr-1" />
            <span className="text-success font-medium">+8.2%</span>
            <span className="text-secondary-500 ml-1">vs média</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Taxa de Conversão
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.conversao}%
              </p>
            </div>
            <div className="bg-error-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-error" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-secondary-600">
              De visitantes para clientes
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por cliente ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            <option>Todos os status</option>
            <option>Pago</option>
            <option>Pendente</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">
            Vendas Recentes
          </h3>
          <button className="btn-secondary text-sm">Exportar</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Produto/Serviço
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Valor
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Data
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Método
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-secondary-100 hover:bg-secondary-50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-secondary-900">
                      {sale.customer}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-secondary-600">
                    {sale.product}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-secondary-900">
                      R${" "}
                      {sale.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-secondary-600">
                    {new Date(sale.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-secondary-600">
                      {getMethodIcon(sale.method)}
                      <span className="capitalize">{sale.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        sale.status
                      )}`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-600 text-sm">
                        Ver
                      </button>
                      <button className="text-secondary-600 hover:text-secondary-800 text-sm">
                        Recibo
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
