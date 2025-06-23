"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, logoutAction } from "@/actions/auth";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  // Verificar autenticação inicial
  const checkAuth = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const user = await getAuthUser();

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });

      return user;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return null;
    }
  }, []);

  // Fazer logout
  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      await logoutAction();

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      router.push("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
      // Limpar estado local mesmo se der erro
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push("/login");
    }
  }, [router]);

  // Atualizar dados do usuário
  const refreshAuth = useCallback(async () => {
    return await checkAuth();
  }, [checkAuth]);

  // Verificar se está em uma rota protegida
  const requireAuth = useCallback(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  }, [authState.isLoading, authState.isAuthenticated, router]);

  // Verificar autenticação na montagem do componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificar periodicamente se o token ainda é válido
  useEffect(() => {
    if (authState.isAuthenticated) {
      const interval = setInterval(() => {
        checkAuth();
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, checkAuth]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    checkAuth,
    logout,
    refreshAuth,
    requireAuth,
  };
}
