"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import mockProductsData from "@/data/mockProducts.json";

// Mock data para o dashboard
const mockStats = {
  totalRevenue: 15750.5,
  totalOrders: 142,
  totalProducts: mockProductsData.length,
  totalUsers: 89,
  revenueChange: +12.5,
  ordersChange: +8.3,
  productsChange: +2.1,
  usersChange: +15.7,
};

const mockRecentOrders = [
  {
    id: "001",
    customer: "João Silva",
    total: 299.9,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "002",
    customer: "Maria Santos",
    total: 159.9,
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "003",
    customer: "Pedro Costa",
    total: 89.9,
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "004",
    customer: "Ana Oliveira",
    total: 449.9,
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "005",
    customer: "Carlos Ferreira",
    total: 199.9,
    status: "shipped",
    date: "2024-01-13",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "pending":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "processing":
      return "text-blue-700 bg-blue-50 border-blue-200";
    case "shipped":
      return "text-purple-700 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Concluído";
    case "pending":
      return "Pendente";
    case "processing":
      return "Processando";
    case "shipped":
      return "Enviado";
    default:
      return status;
  }
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Acesso livre em desenvolvimento
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasAccess = isDevelopment || (user && user.role === "admin");

  useEffect(() => {
    if (isDevelopment && !user) {
      success("Acesso de desenvolvimento liberado para dashboard admin");
    }
  }, [isDevelopment, user, success]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta área.
          </p>
          <Link href="/">
            <Button
              variant="primary"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = mockProductsData.filter(
    (product: any) =>
      (product.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (product.categoria?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const sidebarItems = [
    { name: "Dashboard", icon: BarChart3, href: "/admin", active: true },
    { name: "Produtos", icon: Package, href: "/admin/products" },
    { name: "Pedidos", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Usuários", icon: Users, href: "/admin/users" },
    { name: "Configurações", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
          <span className="text-xl font-bold text-white">BemmeCare Admin</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-6">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    item.active
                      ? "text-purple-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.[0] || "A"}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-3 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {isDevelopment
                    ? "Modo Desenvolvimento"
                    : `Bem-vindo, ${user?.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Ver Loja
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-full overflow-x-hidden">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              {
                title: "Receita Total",
                value: `R$ ${mockStats.totalRevenue.toFixed(2)}`,
                change: mockStats.revenueChange,
                icon: DollarSign,
                color: "from-emerald-500 to-emerald-600",
                bgColor: "from-emerald-50 to-emerald-100",
                textColor: "text-emerald-700",
              },
              {
                title: "Pedidos",
                value: mockStats.totalOrders.toString(),
                change: mockStats.ordersChange,
                icon: ShoppingCart,
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100",
                textColor: "text-blue-700",
              },
              {
                title: "Produtos",
                value: mockStats.totalProducts.toString(),
                change: mockStats.productsChange,
                icon: Package,
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100",
                textColor: "text-purple-700",
              },
              {
                title: "Usuários",
                value: mockStats.totalUsers.toString(),
                change: mockStats.usersChange,
                icon: Users,
                color: "from-amber-500 to-amber-600",
                bgColor: "from-amber-50 to-amber-100",
                textColor: "text-amber-700",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          {stat.title}
                        </p>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                          {stat.value}
                        </p>
                        <div className="flex items-center mt-3">
                          <div
                            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${stat.textColor} bg-gradient-to-r ${stat.bgColor}`}
                          >
                            {stat.change > 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {stat.change > 0 ? "+" : ""}
                            {stat.change}%
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            vs mês anterior
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3 lg:p-4 rounded-2xl bg-gradient-to-r ${stat.bgColor} flex-shrink-0`}
                      >
                        <stat.icon
                          className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.textColor}`}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Pedidos Recentes */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Pedidos Recentes
                    </h3>
                    <Link href="/admin/orders">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        Ver Todos
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentOrders.map((order, index) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingCart className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              #{order.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.customer}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            R$ {order.total.toFixed(2)}
                          </p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ações Rápidas
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Novo Produto",
                        href: "/admin/products/new",
                        icon: Plus,
                        color: "from-emerald-500 to-emerald-600",
                        bgColor: "from-emerald-50 to-emerald-100",
                        textColor: "text-emerald-700",
                      },
                      {
                        title: "Gerenciar Pedidos",
                        href: "/admin/orders",
                        icon: ShoppingCart,
                        color: "from-blue-500 to-blue-600",
                        bgColor: "from-blue-50 to-blue-100",
                        textColor: "text-blue-700",
                      },
                      {
                        title: "Ver Usuários",
                        href: "/admin/users",
                        icon: Users,
                        color: "from-purple-500 to-purple-600",
                        bgColor: "from-purple-50 to-purple-100",
                        textColor: "text-purple-700",
                      },
                      {
                        title: "Relatórios",
                        href: "/admin/reports",
                        icon: BarChart3,
                        color: "from-amber-500 to-amber-600",
                        bgColor: "from-amber-50 to-amber-100",
                        textColor: "text-amber-700",
                      },
                    ].map((action, index) => (
                      <Link key={index} href={action.href}>
                        <div className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 transform hover:scale-105 cursor-pointer">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${action.bgColor} group-hover:shadow-md transition-shadow`}
                          >
                            <action.icon
                              className={`h-6 w-6 ${action.textColor}`}
                            />
                          </div>
                          <span className="ml-4 font-medium text-gray-900 group-hover:text-gray-700">
                            {action.title}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Produtos - Tabela */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Produtos</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all w-80"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Produto
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Categoria
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Preço
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Estoque
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts
                        .slice(0, 8)
                        .map((product: any, index) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                                  <Package className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 line-clamp-1">
                                    {product.nome || "Nome não disponível"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ID: {product.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-700">
                              {product.categoria || "Categoria não disponível"}
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900">
                                R$ {(product.preco || 0).toFixed(2)}
                              </span>
                              {product.precoAntigo && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  R$ {product.precoAntigo.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  (product.estoque || 0) > 10
                                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                    : (product.estoque || 0) > 0
                                    ? "text-amber-700 bg-amber-50 border border-amber-200"
                                    : "text-red-700 bg-red-50 border border-red-200"
                                }`}
                              >
                                {product.estoque || 0} unidades
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length > 8 && (
                  <div className="mt-6 text-center">
                    <Link href="/admin/products">
                      <Button
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        Ver Todos os Produtos ({filteredProducts.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
