"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  Heart,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";

const menuItems = [
  {
    name: "Painel",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Agendamentos",
    icon: Calendar,
    href: "/dashboard/agendamentos",
  },
  {
    name: "Vendas",
    icon: ShoppingCart,
    href: "/dashboard/vendas",
  },
  {
    name: "Produtos",
    icon: Package,
    href: "/dashboard/produtos",
  },
  {
    name: "Relatórios",
    icon: FileText,
    href: "/dashboard/relatorios",
  },
  {
    name: "Configurações",
    icon: Settings,
    href: "/dashboard/configuracoes",
  },
];

interface SidebarProps {
  user?: User | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Função para obter iniciais do nome
  const getInitials = (name?: string): string => {
    if (!name) return "AD";

    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-secondary-200">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-secondary-900">BemMeCare</h1>
          <p className="text-sm text-secondary-500">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx("sidebar-item", isActive && "active")}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-secondary-200">
        <div className="bg-secondary-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="font-medium">{getInitials(user?.name)}</span>
            </div>
            <div>
              <p className="font-medium text-secondary-900">
                {user?.name || "Usuário"}
              </p>
              <p className="text-sm text-secondary-500">
                {user?.role || "Usuário"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
