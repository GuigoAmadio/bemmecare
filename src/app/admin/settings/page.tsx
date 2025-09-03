"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Store,
  CreditCard,
  Package,
  Menu,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PersonalInfoSection from "@/components/admin/settings/PersonalInfoSection";
import SecuritySection from "@/components/admin/settings/SecuritySection";
import PreferencesSection from "@/components/admin/settings/PreferencesSection";
import NotificationsSection from "@/components/admin/settings/NotificationsSection";
import StoreConfigSection from "@/components/admin/settings/StoreConfigSection";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    {
      id: "personal",
      name: "Informações Pessoais",
      icon: User,
      component: PersonalInfoSection,
    },
    {
      id: "security",
      name: "Segurança",
      icon: Shield,
      component: SecuritySection,
    },
    {
      id: "preferences",
      name: "Preferências",
      icon: Globe,
      component: PreferencesSection,
    },
    {
      id: "notifications",
      name: "Notificações",
      icon: Bell,
      component: NotificationsSection,
    },
    {
      id: "store",
      name: "Configurações da Loja",
      icon: Store,
      component: StoreConfigSection,
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || PersonalInfoSection;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-purple-600" />
                    Configurações
                  </h1>
                  <p className="text-sm text-gray-600">
                    Gerencie suas configurações e preferências
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Tabs Sidebar */}
              <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Seções
                  </h2>
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-l-4 border-purple-600"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <tab.icon
                          className={`h-5 w-5 ${
                            activeTab === tab.id
                              ? "text-purple-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Quick Actions */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Ações Rápidas
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <CreditCard className="h-4 w-4" />
                      Métodos de Pagamento
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Package className="h-4 w-4" />
                      Configurar Envios
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <ActiveComponent />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
