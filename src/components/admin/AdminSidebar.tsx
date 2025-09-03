"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clsx } from "clsx";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: BarChart3,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      name: "Produtos",
      icon: Package,
      href: "/admin/products",
      active: pathname === "/admin/products",
    },
    {
      name: "Pedidos",
      icon: ShoppingCart,
      href: "/admin/orders",
      active: pathname === "/admin/orders",
    },
    {
      name: "Usuários",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      name: "Configurações",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ];

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:flex lg:flex-col flex-shrink-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
        <span className="text-xl font-bold text-white">BemmeCare Admin</span>
        <button
          onClick={onClose}
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
                  ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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

      <div className="mt-auto p-6">
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
  );
}
