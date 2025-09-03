"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  Eye,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { User } from "@/types";
import { getUsers } from "@/actions/users";
import { cacheHelpers } from "@/lib/cache-utils";

interface UsersSectionProps {
  onBack: () => void;
}

export default function UsersSection({ onBack }: UsersSectionProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "customer" | "admin" | "moderator"
  >("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Primeiro, tenta buscar do cache
      const cachedUsers = cacheHelpers.user?.get("all") as User[] | null;

      if (cachedUsers) {
        console.log("📦 Usuários carregados do cache");
        setUsers(cachedUsers);
        setLoading(false);
        return;
      }

      // Se não estiver no cache, busca do backend
      console.log("🌐 Buscando usuários do backend");
      const fetchedUsers = await getUsers();

      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super_admin":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200";
      case "moderator":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200";
      case "customer":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super_admin":
        return "Administrador";
      case "moderator":
        return "Moderador";
      case "customer":
        return "Cliente";
      default:
        return role;
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <UserCheck className="h-4 w-4 text-green-600" />
    ) : (
      <UserX className="h-4 w-4 text-red-600" />
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-text-muted">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Usuários</h1>
            <p className="text-text-muted">Gerencie clientes e funcionários</p>
          </div>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all">
          <UserPlus className="h-4 w-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-text-muted" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="all">Todas as Funções</option>
              <option value="customer">Clientes</option>
              <option value="moderator">Moderadores</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 p-6 hover:shadow-xl transition-all group hover:transform hover:scale-105"
          >
            {/* User Avatar & Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-text-muted">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(user.isActive)}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-3">
              {/* Role Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
                <span
                  className={`text-sm font-medium ${
                    user.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-text-muted space-y-1">
                {user.phone && <div>📞 {user.phone}</div>}
                <div>
                  📅 Criado em{" "}
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </div>
                {user.isEmailVerified && (
                  <div className="text-green-600">✅ Email verificado</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-3 border-t border-border/20">
                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <Eye className="h-3 w-3" />
                  <span className="text-sm">Ver Perfil</span>
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <span className="text-sm">Editar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-text-muted mb-4">
            {searchTerm || filterRole !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando o primeiro usuário"}
          </p>
          {!searchTerm && filterRole === "all" && (
            <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all">
              Adicionar Usuário
            </button>
          )}
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-2xl font-bold text-slate-700">
              {users.length}
            </div>
            <div className="text-sm text-slate-600">Total de Usuários</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">
              {users.filter((u) => u.role.toLowerCase() === "customer").length}
            </div>
            <div className="text-sm text-emerald-600">Clientes</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-2xl font-bold text-blue-700">
              {users.filter((u) => u.role.toLowerCase() === "moderator").length}
            </div>
            <div className="text-sm text-blue-600">Moderadores</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-2xl font-bold text-purple-700">
              {
                users.filter(
                  (u) =>
                    u.role.toLowerCase() === "admin" ||
                    u.role.toLowerCase() === "super_admin"
                ).length
              }
            </div>
            <div className="text-sm text-purple-600">Administradores</div>
          </div>
        </div>
      </div>
    </div>
  );
}
