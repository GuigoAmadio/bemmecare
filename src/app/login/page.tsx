"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@bemmecare.com",
      password: "password",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await loginAction(data);

      if (result.success) {
        // Redirecionar para dashboard
        router.push("/dashboard");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Erro interno do servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-secondary-600 hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao início
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-secondary-900">
                BemMeCare
              </h1>
            </div>
            <h2 className="text-xl text-secondary-600">Área Administrativa</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  errors.email ? "border-error" : "border-secondary-300"
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.password ? "border-error" : "border-secondary-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-secondary-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-secondary-600">
                  Lembrar-me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary-600"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-secondary-200">
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-medium text-secondary-900 mb-2">
                Credenciais de Teste:
              </h3>
              <p className="text-sm text-secondary-600">
                <strong>Email:</strong> admin@bemmecare.com
                <br />
                <strong>Senha:</strong> password
              </p>
              <p className="text-xs text-secondary-500 mt-2">
                * Esta aplicação se conecta ao backend NestJS na porta 3000
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-secondary-500 text-sm">
            © 2025 BemMeCare. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
