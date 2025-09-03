export interface AuthUser {
  id: string;
  clientId?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  employeeId?: string;
  lockedUntil?: string;
  failedLoginAttempts: number;
  client?: {
    id: string;
    name: string;
    status: string;
  };
  employees?: Array<{
    id: string;
    isActive: boolean;
  }>;
}

export interface AuthMeResponse {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  client_id?: string;
  clientId?: string;
  client?: {
    id: string;
    name: string;
    status: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    client_id: string;
    user: AuthUser;
    refresh_token: string;
    expires_in: string | number;
  };
}
export interface AuthActionsResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  clientId?: string;
  token?: string;
}
