"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Award,
  ShoppingCart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
} from "recharts";

// Dados mock para gráficos
const salesData = [
  { name: "Jan", vendas: 12400, receita: 45600, clientes: 120 },
  { name: "Fev", vendas: 15600, receita: 52300, clientes: 145 },
  { name: "Mar", vendas: 18200, receita: 61200, clientes: 167 },
  { name: "Abr", vendas: 16800, receita: 58900, clientes: 152 },
  { name: "Mai", vendas: 21300, receita: 67800, clientes: 189 },
  { name: "Jun", vendas: 25100, receita: 78200, clientes: 215 },
];

const weeklyData = [
  { name: "Seg", agendamentos: 12, receita: 2400 },
  { name: "Ter", agendamentos: 15, receita: 3200 },
  { name: "Qua", agendamentos: 18, receita: 4100 },
  { name: "Qui", agendamentos: 14, receita: 3600 },
  { name: "Sex", agendamentos: 22, receita: 5200 },
  { name: "Sáb", agendamentos: 8, receita: 1800 },
  { name: "Dom", agendamentos: 5, receita: 1200 },
];

const categoryData = [
  { name: "Barras", value: 35, color: "#3B82F6" },
  { name: "Bastão", value: 28, color: "#10B981" },
  { name: "Consulta", value: 22, color: "#8B5CF6" },
  { name: "Avaliação", value: 15, color: "#F59E0B" },
];

const topProducts = [
  { name: "Treino Personalizado", vendas: 45, receita: 4500 },
  { name: "Avaliação Completa", vendas: 32, receita: 3840 },
  { name: "Sessão de Barras", vendas: 28, receita: 2240 },
  { name: "Treino em Grupo", vendas: 24, receita: 1920 },
  { name: "Consulta Nutricional", vendas: 18, receita: 2160 },
];

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  const [selectedChart, setSelectedChart] = useState("vendas");

  const quickStats = {
    totalReceita: 125430.5,
    totalPacientes: 1248,
    consultasRealizadas: 856,
    produtosVendidos: 234,
    crescimentoReceita: 18.2,
    crescimentoClientes: 12.5,
    taxaComparecimento: 95.8,
    ticketMedio: 142.3,
  };

  const getChartData = () => {
    switch (selectedChart) {
      case "vendas":
        return { data: salesData, dataKey: "vendas", color: "#3B82F6" };
      case "receita":
        return { data: salesData, dataKey: "receita", color: "#10B981" };
      case "clientes":
        return { data: salesData, dataKey: "clientes", color: "#8B5CF6" };
      default:
        return { data: salesData, dataKey: "vendas", color: "#3B82F6" };
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">
            Análises e insights do seu negócio
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Novo Relatório</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Período de Análise
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Selecione o período para visualizar os dados
            </p>
          </div>
          <div className="flex space-x-2">
            {[
              { value: "semana", label: "7 dias" },
              { value: "mes", label: "30 dias" },
              { value: "trimestre", label: "90 dias" },
              { value: "ano", label: "12 meses" },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {quickStats.totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+{quickStats.crescimentoReceita}%</span>
            <span className="text-gray-500 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.totalPacientes}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+{quickStats.crescimentoClientes}%</span>
            <span className="text-gray-500 ml-1">novos cadastros</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultas Realizadas</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.consultasRealizadas}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Activity className="h-4 w-4 text-blue-600 mr-1" />
            <span className="text-gray-600">Taxa: {quickStats.taxaComparecimento}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {quickStats.ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Award className="h-4 w-4 text-orange-600 mr-1" />
            <span className="text-gray-600">Por cliente</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tendência de Performance
            </h3>
            <select 
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="vendas">Vendas</option>
              <option value="receita">Receita</option>
              <option value="clientes">Clientes</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.data}>
              <defs>
                <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartData.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartData.color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey={chartData.dataKey}
                stroke={chartData.color}
                fillOpacity={1}
                fill="url(#colorChart)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Distribuição por Categoria
          </h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Performance & Top Products */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Performance Semanal
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="agendamentos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Serviços Mais Vendidos
          </h3>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.vendas} vendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {product.receita.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-gray-600">receita</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Métricas de Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">87%</p>
            <p className="text-sm text-gray-600">Taxa de Conversão</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">92%</p>
            <p className="text-sm text-gray-600">Satisfação do Cliente</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">3.2</p>
            <p className="text-sm text-gray-600">Serviços por Cliente</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Relatórios Disponíveis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Relatório de Vendas", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
            { name: "Relatório de Clientes", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
            { name: "Análise Financeira", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-100" },
            { name: "Performance Geral", icon: Activity, color: "text-orange-600", bg: "bg-orange-100" },
          ].map((report, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`${report.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                <report.icon className={`h-5 w-5 ${report.color}`} />
              </div>
              <p className="font-medium text-gray-900">{report.name}</p>
              <p className="text-sm text-gray-600 mt-1">Gerar relatório PDF</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 