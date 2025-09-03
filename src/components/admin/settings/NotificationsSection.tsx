"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Phone, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import SettingsSection from "./SettingsSection";
import { useNotification } from "@/context/NotificationContext";

export default function NotificationsSection() {
  const { success } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      orders: true,
      marketing: false,
      security: true,
      updates: true,
    },
    push: {
      orders: true,
      marketing: false,
      security: true,
      updates: false,
    },
    sms: {
      orders: false,
      marketing: false,
      security: true,
      updates: false,
    },
  });

  const notificationTypes = [
    {
      key: "orders",
      label: "Pedidos",
      description: "Novos pedidos, atualizações de status e problemas",
    },
    {
      key: "marketing",
      label: "Marketing",
      description: "Promoções, newsletters e campanhas",
    },
    {
      key: "security",
      label: "Segurança",
      description: "Alertas de segurança e login suspeito",
    },
    {
      key: "updates",
      label: "Atualizações",
      description: "Novos recursos e atualizações do sistema",
    },
  ];

  const channels = [
    { key: "email", label: "E-mail", icon: Mail },
    { key: "push", label: "Push", icon: MessageSquare },
    { key: "SMS", label: "SMS", icon: Phone },
  ];

  const handleToggle = (channel: string, type: string) => {
    setNotifications((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        [type]:
          !prev[channel as keyof typeof prev][type as keyof typeof prev.email],
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Preferências de notificação atualizadas!");
    } catch (err) {
      success("Erro ao atualizar preferências de notificação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Notificações"
      description="Configure como você quer receber notificações"
      icon={Bell}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Tipo de Notificação
              </th>
              {channels.map((channel) => (
                <th
                  key={channel.key}
                  className="text-center py-3 px-4 font-medium text-gray-900"
                >
                  <div className="flex items-center justify-center gap-2">
                    <channel.icon className="h-4 w-4" />
                    {channel.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notificationTypes.map((type) => (
              <tr
                key={type.key}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {type.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {type.description}
                    </div>
                  </div>
                </td>
                {channels.map((channel) => (
                  <td key={channel.key} className="py-4 px-4 text-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          notifications[
                            channel.key.toLowerCase() as keyof typeof notifications
                          ][type.key as keyof typeof notifications.email]
                        }
                        onChange={() =>
                          handleToggle(channel.key.toLowerCase(), type.key)
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Configurações Avançadas */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900">Configurações Avançadas</h4>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Agrupar notificações similares
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Pausar notificações durante horário comercial (9h-18h)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Receber resumo diário por e-mail
            </span>
          </label>
        </div>
      </div>

      {/* Canais de Comunicação */}
      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800">Canais de Comunicação</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <Mail className="h-4 w-4" />
            <span>
              E-mail: {notifications.email.orders ? "Ativo" : "Inativo"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <MessageSquare className="h-4 w-4" />
            <span>Push: {notifications.push.orders ? "Ativo" : "Inativo"}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <Phone className="h-4 w-4" />
            <span>SMS: {notifications.sms.security ? "Ativo" : "Inativo"}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          loading={isLoading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Notificações
        </Button>
      </div>
    </SettingsSection>
  );
}
