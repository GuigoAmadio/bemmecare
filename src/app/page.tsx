"use client";

import Link from "next/link";
import { ArrowRight, Heart, Shield, Users, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-secondary-900">
                BemMeCare
              </h1>
            </div>
            <Link
              href="/login"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Área Logada</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-secondary-900 mb-6 animate-fade-in">
            Cuidando da sua <span className="text-primary">saúde</span> com
            tecnologia
          </h2>
          <p className="text-xl text-secondary-600 mb-8 animate-slide-up">
            Plataforma completa de gestão de saúde e bem-estar, conectando você
            aos melhores cuidados médicos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              href="/login"
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <span>Acessar Plataforma</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-slide-up">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
              Monitoramento Inteligente
            </h3>
            <p className="text-secondary-600">
              Acompanhe sua saúde em tempo real com tecnologia avançada e
              relatórios personalizados.
            </p>
          </div>

          <div className="card text-center animate-slide-up">
            <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
              Segurança Total
            </h3>
            <p className="text-secondary-600">
              Seus dados protegidos com criptografia de ponta e conformidade com
              LGPD.
            </p>
          </div>

          <div className="card text-center animate-slide-up">
            <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
              Equipe Especializada
            </h3>
            <p className="text-secondary-600">
              Conecte-se com profissionais qualificados e receba o melhor
              atendimento.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-secondary-600">Pacientes Atendidos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">500+</div>
              <div className="text-secondary-600">Profissionais</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning mb-2">50+</div>
              <div className="text-secondary-600">Especialidades</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-error mb-2">99.9%</div>
              <div className="text-secondary-600">Disponibilidade</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-bold">BemMeCare</span>
            </div>
            <p className="text-secondary-300">
              © 2025 BemMeCare. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
