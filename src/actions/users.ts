"use server";

import {
  serverGet,
  serverPost,
  serverDelete,
  serverPatch,
} from "@/lib/server-api";
import type { User, RegisterData } from "@/types/user";
import type { AuthUser } from "@/types/auth";
import {
  log,
  handleError,
  validateId,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateNonEmptyString,
  buildQueryParams,
  getApiCount,
  getApiSuccessStatus,
} from "@/utils";

// ==================== CRUD BÁSICO ====================

export async function getUsers(): Promise<User[] | undefined> {
  try {
    const response = await serverGet<User[]>("/users");
    log("[getUsers] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getUsers", error);
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    validateId(id, "ID do usuário");
    const response = await serverGet<User>(`/users/${id}`);
    log("[getUserById] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getUserById", error);
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    validateEmail(email);
    const response = await serverGet<User>(
      `/users/email/${encodeURIComponent(email)}`
    );
    log("[getUserByEmail] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getUserByEmail", error);
  }
}

export async function createUser(
  userData: RegisterData
): Promise<User | undefined> {
  try {
    validateEmail(userData.email);

    if (!userData.firstName?.trim()) {
      throw new Error("Nome é obrigatório");
    }

    if (!userData.lastName?.trim()) {
      throw new Error("Sobrenome é obrigatório");
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error("Senhas não coincidem");
    }

    if (!userData.acceptTerms) {
      throw new Error("É necessário aceitar os termos de uso");
    }

    const response = await serverPost<User>("/users", userData);
    log("[createUser] Response:", response);
    return response.data;
  } catch (error) {
    handleError("createUser", error);
  }
}

export async function updateUser(
  id: string,
  userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User | undefined> {
  try {
    validateId(id, "ID do usuário");

    if (userData.email) {
      validateEmail(userData.email);
    }

    const response = await serverPatch<User>(`/users/${id}`, userData);
    log("[updateUser] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateUser", error);
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do usuário");
    const response = await serverDelete<{ success: boolean }>(`/users/${id}`);
    log("[deleteUser] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("deleteUser", error);
    return false;
  }
}

// ==================== PERFIL DO USUÁRIO ====================

export async function getCurrentUser(): Promise<AuthUser | undefined> {
  try {
    const response = await serverGet<AuthUser>("/users/me");
    log("[getCurrentUser] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getCurrentUser", error);
  }
}

export async function updateProfile(profileData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}): Promise<User | undefined> {
  try {
    if (profileData.firstName && !profileData.firstName.trim()) {
      throw new Error("Nome não pode estar vazio");
    }

    if (profileData.lastName && !profileData.lastName.trim()) {
      throw new Error("Sobrenome não pode estar vazio");
    }

    const response = await serverPatch<User>("/users/profile", profileData);
    log("[updateProfile] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateProfile", error);
  }
}

export async function updateAvatar(avatar: string): Promise<User | undefined> {
  try {
    if (!avatar?.trim()) {
      throw new Error("Avatar é obrigatório");
    }

    const response = await serverPatch<User>("/users/avatar", { avatar });
    log("[updateAvatar] Response:", response);
    return response.data;
  } catch (error) {
    handleError("updateAvatar", error);
  }
}

// ==================== SENHA E SEGURANÇA ====================

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<boolean> {
  try {
    if (!currentPassword?.trim()) {
      throw new Error("Senha atual é obrigatória");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error("Nova senha deve ter pelo menos 6 caracteres");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Nova senha e confirmação não coincidem");
    }

    if (currentPassword === newPassword) {
      throw new Error("Nova senha deve ser diferente da senha atual");
    }

    const response = await serverPatch<{ success: boolean }>(
      "/users/change-password",
      { currentPassword, newPassword, confirmPassword }
    );
    log("[changePassword] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("changePassword", error);
    return false;
  }
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    validateEmail(email);

    const response = await serverPost<{ success: boolean }>(
      "/users/request-password-reset",
      { email }
    );
    log("[requestPasswordReset] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("requestPasswordReset", error);
    return false;
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<boolean> {
  try {
    if (!token?.trim()) {
      throw new Error("Token de redefinição é obrigatório");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error("Nova senha deve ter pelo menos 6 caracteres");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Nova senha e confirmação não coincidem");
    }

    const response = await serverPost<{ success: boolean }>(
      "/users/reset-password",
      { token, newPassword, confirmPassword }
    );
    log("[resetPassword] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("resetPassword", error);
    return false;
  }
}

// ==================== VERIFICAÇÃO DE EMAIL ====================

export async function requestEmailVerification(): Promise<boolean> {
  try {
    const response = await serverPost<{ success: boolean }>(
      "/users/request-email-verification",
      {}
    );
    log("[requestEmailVerification] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("requestEmailVerification", error);
    return false;
  }
}

export async function verifyEmail(token: string): Promise<boolean> {
  try {
    if (!token?.trim()) {
      throw new Error("Token de verificação é obrigatório");
    }

    const response = await serverPost<{ success: boolean }>(
      "/users/verify-email",
      { token }
    );
    log("[verifyEmail] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("verifyEmail", error);
    return false;
  }
}

// ==================== BUSCA E FILTROS ====================

export async function searchUsers(query: {
  search?: string;
  role?: User["role"];
  isActive?: boolean;
  isEmailVerified?: boolean;
  sortBy?: "firstName" | "lastName" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<
  | {
      users: User[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.set(key, value.toString());
      }
    });

    const response = await serverGet<{
      users: User[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/users/search?${queryParams.toString()}`);
    log("[searchUsers] Response:", response);
    return response.data;
  } catch (error) {
    handleError("searchUsers", error);
  }
}

export async function getUsersByRole(
  role: User["role"]
): Promise<User[] | undefined> {
  try {
    if (!role?.trim()) {
      throw new Error("Role é obrigatório");
    }

    const response = await serverGet<User[]>(`/users/role/${role}`);
    log("[getUsersByRole] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getUsersByRole", error);
  }
}

// ==================== ADMINISTRAÇÃO ====================

export async function activateUser(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do usuário");
    const response = await serverPatch<{ success: boolean }>(
      `/users/${id}/activate`,
      {}
    );
    log("[activateUser] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("activateUser", error);
    return false;
  }
}

export async function deactivateUser(id: string): Promise<boolean> {
  try {
    validateId(id, "ID do usuário");
    const response = await serverPatch<{ success: boolean }>(
      `/users/${id}/deactivate`,
      {}
    );
    log("[deactivateUser] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("deactivateUser", error);
    return false;
  }
}

export async function updateUserRole(
  id: string,
  role: User["role"]
): Promise<boolean> {
  try {
    validateId(id, "ID do usuário");

    if (!role?.trim()) {
      throw new Error("Role é obrigatório");
    }

    const validRoles: User["role"][] = ["customer", "admin", "moderator"];
    if (!validRoles.includes(role)) {
      throw new Error("Role inválido");
    }

    const response = await serverPatch<{ success: boolean }>(
      `/users/${id}/role`,
      { role }
    );
    log("[updateUserRole] Response:", response);
    return response.data?.success || false;
  } catch (error) {
    handleError("updateUserRole", error);
    return false;
  }
}

// ==================== ESTATÍSTICAS ====================

export async function getUsersCount(): Promise<number | undefined> {
  try {
    const response = await serverGet<{ count: number }>("/users/count");
    log("[getUsersCount] Response:", response);
    return response.data?.count;
  } catch (error) {
    handleError("getUsersCount", error);
  }
}

export async function getUsersStats(): Promise<
  | {
      total: number;
      active: number;
      inactive: number;
      verified: number;
      unverified: number;
      byRole: Record<User["role"], number>;
    }
  | undefined
> {
  try {
    const response = await serverGet<{
      total: number;
      active: number;
      inactive: number;
      verified: number;
      unverified: number;
      byRole: Record<User["role"], number>;
    }>("/users/stats");
    log("[getUsersStats] Response:", response);
    return response.data;
  } catch (error) {
    handleError("getUsersStats", error);
  }
}

// ==================== VALIDAÇÕES ====================

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    validateEmail(email);
    const response = await serverGet<{ exists: boolean }>(
      `/users/check-email/${encodeURIComponent(email)}`
    );
    log("[checkEmailExists] Response:", response);
    return response.data?.exists || false;
  } catch (error) {
    handleError("checkEmailExists", error);
    return false;
  }
}
