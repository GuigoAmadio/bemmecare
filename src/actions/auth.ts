"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  LoginInput,
  AuthResponse,
  AuthActionsResponse,
  RegisterInput,
  AuthUser,
} from "@/types/auth";
import { serverPost, serverGet } from "@/lib/server-api";
import { cacheUtils, cacheHelpers } from "@/lib/cache-utils";

export async function loginAction(
  data: LoginInput
): Promise<AuthActionsResponse> {
  try {
    // Limpar cache de usuário anterior antes do novo login
    cacheUtils.delete("profile:current-user");
    cacheUtils.invalidateByTag("profile");

    const response = await serverPost<AuthResponse>("/auth/login", data);
    console.log("📋 Resposta vinda do server-api:", response);

    if (
      !(response.data as any)?.token ||
      !(response.data as any)?.user ||
      !(response.data as any)?.client_id
    ) {
      console.error(
        "❌ Token ou usuário ou client_id não encontrado na resposta!"
      );
      console.error("📋 Dados encontrados:", Object.keys(response || {}));
      return {
        success: false,
        message: "Tem coisa não sendo enviada",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("auth_token", (response.data as any).token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    // Salvar client_id do usuário autenticado
    cookieStore.set("client_id", (response.data as any).client_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    // Salvar refresh token se fornecido
    if ((response.data as any).refresh_token) {
      cookieStore.set("refresh_token", (response.data as any).refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    if ((response.data as any)?.user) {
      console.log("💾 [Auth] Salvando dados do usuário no cache...");
      const userForCache = {
        id: (response.data as any).user.id,
        name: (response.data as any).user.name,
        email: (response.data as any).user.email,
        role: (response.data as any).user.role,
        clientId: (response.data as any).client_id,
        // NÃO cachear tokens, senhas ou dados sensíveis
      };

      cacheHelpers.user.set("current", userForCache);
    }

    if ((response.data as any)?.user?.role) {
      const userRole = (response.data as any).user.role.toUpperCase();
      console.log(`🚀 [Auth] Iniciando prefetchs para role: ${userRole}`);

      // Executar prefetchs em background (não bloquear o login)
      // executeRoleBasedPrefetch(userRole)
      //   .then((prefetchResult) => {
      //     if (prefetchResult.success) {
      //       console.log(
      //         `✅ [Auth] Prefetchs concluídos: ${prefetchResult.successCount}/${prefetchResult.totalPrefetches} em ${prefetchResult.duration}ms`
      //       );
      //     } else {
      //       console.error(
      //         `❌ [Auth] Erro nos prefetchs:`,
      //         prefetchResult.error
      //       );
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("❌ [Auth] Erro ao executar prefetchs:", error);
      //   });
    }
    return {
      success: true,
      message: "Login realizado com sucesso",
      user: (response.data as any).user,
      clientId: (response.data as any).client_id,
      token: (response.data as any).token, // Incluir token para localStorage
    };
  } catch (error: unknown) {
    console.error("❌ Expatriamente - Erro no login:", error);
    console.error("❌ Erro completo:", JSON.stringify(error, null, 2));

    // Usar o sistema de sanitização de erros
    const { extractErrorMessage } = await import("@/lib/error-utils");
    const errorMessage = extractErrorMessage(error);

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function logoutAction() {
  try {
    const result = await serverPost<void>("/auth/logout");
    console.log("📋 Resposta:", result);
  } catch (error: unknown) {
    console.error("❌ Expatriamente - Erro no logout no backend:", error);
    console.error("❌ Erro completo:", JSON.stringify(error, null, 2));
  }

  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("client_id");
  await cacheUtils.invalidateByTag("profile");
  await cacheUtils.delete("profile:current-user");
  redirect("/auth/signin");
}

export async function registerAction(
  data: RegisterInput
): Promise<AuthActionsResponse> {
  try {
    const result = await serverPost<AuthResponse>("/auth/register", data);
    console.log("📋 Resposta:", result);

    if (
      !(result.data as any)?.token ||
      !(result.data as any)?.client_id ||
      !(result.data as any)?.user
    ) {
      console.error(
        "❌ Token ou usuário ou client_id não encontrado na resposta!"
      );
      console.error("📋 Dados encontrados:", Object.keys(result.data || {}));
      return {
        success: false,
        message: "Token ou usuário ou client_id não recebido do servidor",
      };
    }
    // Salvar tokens e client_id nos cookies httpOnly
    const cookieStore = await cookies();

    cookieStore.set("auth_token", (result.data as any).token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    // Salvar client_id do usuário autenticado
    cookieStore.set("client_id", (result.data as any).client_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    // Salvar refresh token se fornecido
    if ((result.data as any).refresh_token) {
      cookieStore.set("refresh_token", (result.data as any).refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    // Cache do usuário registrado (sem dados sensíveis)
    if ((result.data as any)?.user) {
      const userForCache = {
        id: (result.data as any).user.id,
        name: (result.data as any).user.name,
        email: (result.data as any).user.email,
        role: (result.data as any).user.role,
        clientId: (result.data as any).client_id,
        // NÃO cachear tokens, senhas ou dados sensíveis
      };

      cacheHelpers.user.set((result.data as any).user.id, userForCache);
      console.log("✅ [Auth] Dados do usuário registrado salvos no cache");
    }

    // ✅ EXECUTAR PREFETCHS BASEADOS NA ROLE (registro)
    if ((result.data as any)?.user?.role) {
      const userRole = (result.data as any).user.role.toUpperCase();
      console.log(
        `🚀 [Auth] Iniciando prefetchs para usuário registrado com role: ${userRole}`
      );

      // Executar prefetchs em background (não bloquear o registro)
      //executeRoleBasedPrefetch(userRole)
      //  .then((prefetchResult) => {
      //    if (prefetchResult.success) {
      //      console.log(
      //        `✅ [Auth] Prefetchs de registro concluídos: ${prefetchResult.successCount}/${prefetchResult.totalPrefetches} em ${prefetchResult.duration}ms`
      //      );
      //    } else {
      //      console.error(
      //        `❌ [Auth] Erro nos prefetchs de registro:`,
      //        prefetchResult.error
      //      );
      //    }
      //  })
      //  .catch((error) => {
      //    console.error(
      //      "❌ [Auth] Erro ao executar prefetchs de registro:",
      //      error
      //    );
      //  });
    }

    return {
      success: true,
      message: "Registro realizado com sucesso",
      user: (result.data as any).user,
      clientId: (result.data as any).client_id,
    };
  } catch (error: unknown) {
    console.error("❌ Expatriamente - Erro no registro:", error);
    console.error("❌ Erro completo:", JSON.stringify(error, null, 2));

    // Usar o sistema de sanitização de erros
    const { extractErrorMessage } = await import("@/lib/error-utils");
    const errorMessage = extractErrorMessage(error);

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cachedUser = await cacheUtils.getOrSet(
      "profile:current-user",
      async () => {
        console.log("🔍 [Auth] Buscando dados do usuário no backend...");
        const result = await serverGet<AuthUser>("/auth/me");

        // NÃO cachear tokens ou dados sensíveis
        const userForCache: AuthUser = {
          id: result.data?.id || "",
          clientId: result.data?.clientId || "",
          employeeId: result.data?.employeeId || "",
          name: result.data?.name || "",
          email: result.data?.email || "",
          role: result.data?.role || "",
          status: result.data?.status || "active",
          emailVerified: result.data?.emailVerified || false,
          failedLoginAttempts: result.data?.failedLoginAttempts || 0,
          createdAt: result.data?.createdAt || "",
          updatedAt: result.data?.updatedAt || "",
          // Remover dados sensíveis antes de cachear
        };

        return userForCache;
      },
      { ttl: 5 * 60 * 1000, tags: ["profile"] } // 5 minutos para dados de auth
    );

    return cachedUser;
  } catch (error: unknown) {
    console.error("❌ Expatriamente - Erro no getAuthUser no backend:", error);
    console.error("❌ Erro completo:", JSON.stringify(error, null, 2));
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return user;
}

async function executeRoleBasedPrefetch(userRole: string) {
  try {
    console.log(`🚀 [Auth] Executando prefetchs para role: ${userRole}`);

    // Importar prefetchs dinamicamente para evitar circular dependencies
    const {
      prefetchDashboardStats,
      prefetchCurrentProfile,
      prefetchTodayAppointments,
      prefetchMyAppointments,
      prefetchEmployees,
      prefetchAvailableServices,
      prefetchAllServices,
    } = await import("@/actions/prefetch");

    // ✅ Função de retry simples
    const retryOnce = async (promise: Promise<any>, prefetchName: string) => {
      try {
        return await promise;
      } catch (error) {
        console.log(`🔄 [Auth] Retry para ${prefetchName}...`);
        try {
          return await promise;
        } catch (retryError) {
          console.error(
            `❌ [Auth] ${prefetchName} falhou após retry:`,
            retryError
          );
          throw retryError;
        }
      }
    };

    const prefetchConfigs: Array<{
      name: string;
      fn: () => Promise<any>;
      essential: boolean;
    }> = [];

    // ✅ Prefetchs ESSENCIAIS para todos os usuários
    const essentialPrefetches = [
      {
        name: "prefetchCurrentProfile",
        fn: prefetchCurrentProfile,
        essential: true,
      },
    ];

    // ✅ Prefetchs BASEADOS NO ROLE
    if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
      // Admins: Dashboard completo + todas as entidades
      const adminPrefetches = [
        {
          name: "prefetchDashboardStats",
          fn: prefetchDashboardStats,
          essential: false,
        },
        {
          name: "prefetchTodayAppointments",
          fn: prefetchTodayAppointments,
          essential: false,
        },
        { name: "prefetchEmployees", fn: prefetchEmployees, essential: false },
        {
          name: "prefetchAllServices",
          fn: prefetchAllServices,
          essential: false,
        },
        {
          name: "prefetchAvailableServices",
          fn: prefetchAvailableServices,
          essential: false,
        },
      ];
      prefetchConfigs.push(...adminPrefetches);
      console.log(
        `🔑 [Auth] Prefetchs ADMIN: ${adminPrefetches
          .map((p) => p.name)
          .join(", ")}`
      );
    } else if (userRole === "EMPLOYEE") {
      // Funcionários: Seus próprios dados + serviços
      const employeePrefetches = [
        {
          name: "prefetchMyAppointments",
          fn: prefetchMyAppointments,
          essential: false,
        },
        {
          name: "prefetchTodayAppointments",
          fn: prefetchTodayAppointments,
          essential: false,
        },
        {
          name: "prefetchAvailableServices",
          fn: prefetchAvailableServices,
          essential: false,
        },
      ];
      prefetchConfigs.push(...employeePrefetches);
      console.log(
        `��‍💼 [Auth] Prefetchs EMPLOYEE: ${employeePrefetches
          .map((p) => p.name)
          .join(", ")}`
      );
    } else {
      // Clientes: Apenas seus próprios dados
      const clientPrefetches = [
        {
          name: "prefetchMyAppointments",
          fn: prefetchMyAppointments,
          essential: false,
        },
        {
          name: "prefetchAvailableServices",
          fn: prefetchAvailableServices,
          essential: false,
        },
      ];
      prefetchConfigs.push(...clientPrefetches);
      console.log(
        `👤 [Auth] Prefetchs CLIENT: ${clientPrefetches
          .map((p) => p.name)
          .join(", ")}`
      );
    }

    // ✅ Adicionar prefetchs essenciais
    prefetchConfigs.push(...essentialPrefetches);
    console.log(
      `⭐ [Auth] Prefetchs ESSENCIAIS: ${essentialPrefetches
        .map((p) => p.name)
        .join(", ")}`
    );

    // ✅ Executar todos os prefetchs em paralelo com timeout otimizado
    const startTime = Date.now();
    const totalPrefetches = prefetchConfigs.length;

    console.log(
      `\n📊 [Auth] Iniciando ${totalPrefetches} prefetchs em paralelo...`
    );

    const results = await Promise.allSettled(
      prefetchConfigs.map(async (config, index) => {
        const prefetchStartTime = Date.now();
        try {
          // ✅ Timeout aumentado para 15 segundos + retry
          const result = await Promise.race([
            retryOnce(config.fn(), config.name),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Prefetch timeout (15s)")),
                15000
              )
            ),
          ]);

          const prefetchDuration = Date.now() - prefetchStartTime;
          console.log(
            `✅ [Auth] ${config.name} concluído em ${prefetchDuration}ms`
          );
          return result;
        } catch (error) {
          const prefetchDuration = Date.now() - prefetchStartTime;
          console.error(
            `❌ [Auth] ${config.name} falhou em ${prefetchDuration}ms:`,
            error
          );
          throw error;
        }
      })
    );

    const duration = Date.now() - startTime;
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    // ✅ Log detalhado de cada prefetch
    console.log(`\n📊 [Auth] Relatório detalhado dos prefetchs:`);
    console.log(`⏱️  Duração total: ${duration}ms`);
    console.log(`✅ Sucessos: ${successCount}/${totalPrefetches}`);
    console.log(`❌ Falhas: ${failureCount}/${totalPrefetches}`);

    // ✅ Listar prefetchs que falharam
    if (failureCount > 0) {
      console.log(`\n❌ [Auth] Prefetchs que falharam:`);
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const config = prefetchConfigs[index];
          const isEssential = config?.essential ? " (ESSENCIAL)" : "";
          console.log(
            `  - ${config?.name}${isEssential}: ${
              result.reason?.message || result.reason
            }`
          );
        }
      });
    }

    // ✅ Verificar se prefetchs essenciais falharam
    const essentialFailures = results.filter((result, index) => {
      const config = prefetchConfigs[index];
      return result.status === "rejected" && config?.essential;
    });

    if (essentialFailures.length > 0) {
      console.warn(
        `⚠️ [Auth] ${essentialFailures.length} prefetchs essenciais falharam!`
      );
    }

    console.log(
      `✅ [Auth] Prefetchs concluídos em ${duration}ms: ${successCount} sucessos, ${failureCount} falhas`
    );

    return {
      success: true,
      totalPrefetches,
      successCount,
      failureCount,
      essentialFailures: essentialFailures.length,
      duration,
    };
  } catch (error) {
    console.error("❌ [Auth] Erro ao executar prefetchs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
