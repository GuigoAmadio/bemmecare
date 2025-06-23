"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("geral");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Configurações Gerais
    businessName: "BemMeCare",
    businessEmail: "contato@bemmecare.com",
    businessPhone: "(11) 99999-9999",
    businessAddress: "Rua das Flores, 123 - São Paulo, SP",

    // Configurações de Usuário
    adminName: "Administrador",
    adminEmail: "admin@bemmecare.com",
    adminPassword: "",

    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    stockAlerts: true,

    // Aparência
    theme: "light",
    primaryColor: "#3B82F6",
    language: "pt-BR",

    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "medium",
  });

  const tabs = [
    { id: "geral", label: "Geral", icon: Settings },
    { id: "usuario", label: "Usuário", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "aparencia", label: "Aparência", icon: Palette },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "dados", label: "Dados", icon: Database },
  ];

  const handleChange = (key: string, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Implementar salvamento das configurações (depois será integrado com o backend)
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Configurações
          </h1>
          <p className="text-secondary-600 mt-2">
            Gerencie as configurações do sistema
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-secondary-700 hover:bg-secondary-50"
                    } ${tab.id === tabs[0].id ? "rounded-t-lg" : ""} ${
                      tab.id === tabs[tabs.length - 1].id ? "rounded-b-lg" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Geral */}
            {activeTab === "geral" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Informações da Empresa
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) =>
                          handleChange("businessName", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email Corporativo
                      </label>
                      <input
                        type="email"
                        value={settings.businessEmail}
                        onChange={(e) =>
                          handleChange("businessEmail", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={settings.businessPhone}
                        onChange={(e) =>
                          handleChange("businessPhone", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={settings.businessAddress}
                        onChange={(e) =>
                          handleChange("businessAddress", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Usuário */}
            {activeTab === "usuario" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Perfil do Administrador
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={settings.adminName}
                        onChange={(e) =>
                          handleChange("adminName", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) =>
                          handleChange("adminEmail", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Nova Senha (deixe vazio para manter a atual)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={settings.adminPassword}
                          onChange={(e) =>
                            handleChange("adminPassword", e.target.value)
                          }
                          className="w-full px-4 py-2 pr-12 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notificações */}
            {activeTab === "notificacoes" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Preferências de Notificação
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-secondary-600" />
                        <div>
                          <p className="font-medium text-secondary-900">
                            Notificações por Email
                          </p>
                          <p className="text-sm text-secondary-600">
                            Receber atualizações por email
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            handleChange("emailNotifications", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-secondary-600" />
                        <div>
                          <p className="font-medium text-secondary-900">
                            Lembretes de Agendamento
                          </p>
                          <p className="text-sm text-secondary-600">
                            Notificar sobre consultas próximas
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.appointmentReminders}
                          onChange={(e) =>
                            handleChange(
                              "appointmentReminders",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-secondary-600" />
                        <div>
                          <p className="font-medium text-secondary-900">
                            Alertas de Estoque
                          </p>
                          <p className="text-sm text-secondary-600">
                            Notificar quando estoque estiver baixo
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.stockAlerts}
                          onChange={(e) =>
                            handleChange("stockAlerts", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aparência */}
            {activeTab === "aparencia" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Personalização Visual
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Tema
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleChange("theme", e.target.value)}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="light">Claro</option>
                        <option value="dark">Escuro</option>
                        <option value="auto">Automático</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Idioma
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          handleChange("language", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança */}
            {activeTab === "seguranca" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Configurações de Segurança
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">
                          Autenticação de Dois Fatores
                        </p>
                        <p className="text-sm text-secondary-600">
                          Adicionar camada extra de segurança
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) =>
                            handleChange("twoFactorAuth", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Tempo de Sessão (minutos)
                      </label>
                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleChange(
                            "sessionTimeout",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value={15}>15 minutos</option>
                        <option value={30}>30 minutos</option>
                        <option value={60}>1 hora</option>
                        <option value={120}>2 horas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dados */}
            {activeTab === "dados" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Gestão de Dados
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                      <h4 className="font-medium text-warning-800 mb-2">
                        Backup de Dados
                      </h4>
                      <p className="text-sm text-warning-700 mb-3">
                        Último backup: {new Date().toLocaleDateString("pt-BR")}
                      </p>
                      <button className="btn-warning text-sm">
                        Fazer Backup Agora
                      </button>
                    </div>

                    <div className="p-4 bg-error-50 rounded-lg border border-error-200">
                      <h4 className="font-medium text-error-800 mb-2">
                        Zona de Perigo
                      </h4>
                      <p className="text-sm text-error-700 mb-3">
                        Ações irreversíveis que afetam permanentemente os dados
                      </p>
                      <div className="space-x-2">
                        <button className="btn-secondary text-sm">
                          Exportar Dados
                        </button>
                        <button className="bg-error hover:bg-error-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                          Resetar Sistema
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
