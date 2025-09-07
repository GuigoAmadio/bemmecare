"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Settings,
  Search,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Package,
  ShoppingCart,
  Users,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSection } from "@/context/SectionContext";
import { AuthUser } from "@/types";

interface DashboardHeaderProps {
  user: AuthUser;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { currentSection, getSectionLabel } = useSection();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super_admin":
        return "Administrador";
      case "moderator":
        return "Moderador";
      default:
        return "Usuário";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super_admin":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200";
      case "moderator":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDotColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super_admin":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "moderator":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  return (
    <header
      className={`bg-white/95 shadow-sm top-0 z-50 relative overflow-hidden ${
        currentSection === "main"
          ? "shadow-purple-200"
          : currentSection === "products"
          ? "shadow-blue-200"
          : currentSection === "orders"
          ? "shadow-green-200"
          : currentSection === "users"
          ? "shadow-pink-200"
          : currentSection === "schedule"
          ? "shadow-purple-200"
          : "shadow-purple-200"
      }`}
    >
      {/* Gradient Background */}
      <div className="relative">
        <div className="flex items-center justify-between h-16 relative px-10">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {/* Exibe a seção atual do dashboard */}
            <span className="text-lg font-semibold text-black capitalize">
              {getSectionLabel(currentSection)}
            </span>
          </div>
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center group">
              <span className="text-2xl font-bold text-black">BemmeCare</span>
            </Link>

            {/* Role Badge */}
            <div
              className={`hidden sm:flex items-center px-3 py-1 rounded-full border ${getRoleColor(
                user.role
              )}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${getRoleDotColor(
                  user.role
                )} mr-2`}
              ></div>
              <span className="text-sm font-medium">
                {getRoleLabel(user.role)}
              </span>
            </div>

            {/* Quick Actions Icons */}
            <div className="hidden lg:flex items-center space-x-1 ml-4">
              <Link
                href="/dashboard?section=products"
                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all group relative"
                title="Produtos"
              >
                <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/dashboard?section=orders"
                className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all group relative"
                title="Pedidos"
              >
                <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/dashboard?section=users"
                className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-all group relative"
                title="Usuários"
              >
                <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/dashboard?section=schedule"
                className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-all group relative"
                title="Agenda"
              >
                <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all group">
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </button>

            {/* Settings */}
            <Link
              href="/dashboard/settings"
              className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
            >
              <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/20 py-4">
            {/* Mobile Role Badge */}
            <div
              className={`sm:hidden flex items-center px-3 py-2 rounded-lg border mb-4 ${getRoleColor(
                user.role
              )}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${getRoleDotColor(
                  user.role
                )} mr-2`}
              ></div>
              <span className="text-sm font-medium">
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
