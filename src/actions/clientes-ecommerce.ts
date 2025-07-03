"use server";

import { serverGet, serverPost } from "@/lib/server-api";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  addresses: Address[];
}

interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface RegisterCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}

interface LoginCustomerDto {
  email: string;
  password: string;
}

export async function registerCustomer(data: RegisterCustomerDto) {
  try {
    const result = await serverPost("/ecommerce/customers/register", data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Cliente registrado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao registrar cliente",
    };
  }
}

export async function loginCustomer(data: LoginCustomerDto) {
  try {
    const result = await serverPost("/ecommerce/customers/login", data);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
      message: "Login realizado com sucesso",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao fazer login",
    };
  }
}

export async function getAllCustomers(page?: number, limit?: number) {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const url = `/ecommerce/customers${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await serverGet(url);

    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao buscar clientes",
    };
  }
}

export async function getCustomer(id: string) {
  try {
    const result = await serverGet<Customer>(`/ecommerce/customers/${id}`);
    return {
      success: true,
      data: (result.data as any)?.data || result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao buscar cliente",
    };
  }
}
