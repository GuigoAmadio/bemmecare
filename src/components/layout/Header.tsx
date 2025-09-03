"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Menu,
  X,
  Search,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CartDropdown from "@/components/layout/CartDropdown";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Catálogo", href: "/catalogo" },
    { name: "Ofertas", href: "/ofertas" },
    { name: "Contato", href: "/contato" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-3 text-sm border-b border-border/50">
          <div className="flex items-center gap-4 text-text-muted">
            <span>✨ Frete grátis para compras acima de R$ 100</span>
          </div>
          <div className="flex items-center gap-6 text-text-muted">
            <Link
              href="/rastreamento"
              className="hover:text-primary transition-colors"
            >
              📦 Rastrear Pedido
            </Link>
            <Link
              href="/ajuda"
              className="hover:text-primary transition-colors"
            >
              💬 Ajuda
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              BemmeCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-primary hover:text-primary transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-primary/10"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Favorites */}
            <Link
              href="/favoritos"
              className="hidden sm:flex items-center justify-center p-2 hover:bg-error/10 hover:text-error relative group rounded-lg transition-all duration-200"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>

            {/* Cart Dropdown */}
            <CartDropdown />

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 p-2 hover:bg-primary/10"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline font-medium">
                    {user?.name || "Usuário"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-border/20 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-border/20">
                      <p className="text-sm font-medium text-text-primary">
                        {user?.name}
                      </p>
                      <p className="text-sm text-text-muted">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/minha-conta/perfil"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Meu Perfil
                      </Link>
                      <Link
                        href="/minha-conta/pedidos"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Meus Pedidos
                      </Link>
                      <Link
                        href="/minha-conta/configuracoes"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Configurações
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border/20 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}

                {/* Backdrop to close dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 font-medium bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <nav className="space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-text-primary hover:text-primary transition-colors duration-200 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-6 border-t border-border">
                  {/* User Info */}
                  <div className="mb-4 p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium text-text-primary">
                      {user?.name}
                    </p>
                    <p className="text-sm text-text-muted">{user?.email}</p>
                  </div>

                  {/* User Links */}
                  <div className="space-y-3">
                    <Link
                      href="/minha-conta/perfil"
                      className="flex items-center gap-3 text-text-primary hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/minha-conta/pedidos"
                      className="flex items-center gap-3 text-text-primary hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Meus Pedidos
                    </Link>
                    <Link
                      href="/minha-conta/configuracoes"
                      className="flex items-center gap-3 text-text-primary hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Configurações
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-error hover:text-error/80 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pt-6 border-t border-border">
                  <Link
                    href="/auth/login"
                    className="w-full px-4 py-3 border-2 border-border text-center text-text-primary hover:text-primary hover:border-primary transition-all rounded-lg font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white text-center rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
