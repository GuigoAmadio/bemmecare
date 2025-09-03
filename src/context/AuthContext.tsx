"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, LoginInput, RegisterInput } from "@/types/auth";
import {
  loginAction,
  registerAction,
  getAuthUser,
  logoutAction,
} from "@/actions/auth";
import { useNotification } from "@/context/NotificationContext";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError, success: showSuccess } = useNotification();

  // Função para verificar autenticação atual
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const authUser = await getAuthUser();
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        localStorage.removeItem("bemmecare_user");
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setUser(null);
      localStorage.removeItem("bemmecare_user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await loginAction(credentials);

      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("bemmecare_user", JSON.stringify(response.user));
        showSuccess("Login realizado com sucesso!");

        // Redirecionar para dashboard se for admin/moderator
        if (
          response.user.role === "admin" ||
          response.user.role === "moderator"
        ) {
          window.location.href = "/dashboard";
        }
      } else {
        throw new Error(response.message || "Erro ao fazer login");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Credenciais inválidas";
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await registerAction(data);

      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("bemmecare_user", JSON.stringify(response.user));
        showSuccess("Conta criada com sucesso!");
      } else {
        throw new Error(response.message || "Erro ao criar conta");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao criar conta";
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      setUser(null);
      localStorage.removeItem("bemmecare_user");
      showSuccess("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpa os dados locais
      setUser(null);
      localStorage.removeItem("bemmecare_user");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem("bemmecare_user", JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error("Erro ao atualizar perfil");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simular reset de senha - substituir por API real
      console.log("Reset password para:", email);
    } catch (error) {
      throw new Error("Erro ao enviar email de recuperação");
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
