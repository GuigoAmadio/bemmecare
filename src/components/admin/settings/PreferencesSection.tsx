"use client";

import { useState } from "react";
import { Globe, Clock, Palette, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import SettingsSection from "./SettingsSection";
import { useNotification } from "@/context/NotificationContext";

export default function PreferencesSection() {
  const { success } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    theme: "light",
    currency: "BRL",
  });

  const languages = [
    { value: "pt-BR", label: "Português (Brasil)" },
    { value: "en-US", label: "English (US)" },
    { value: "es-ES", label: "Español" },
    { value: "fr-FR", label: "Français" },
  ];

  const timezones = [
    { value: "America/Sao_Paulo", label: "(UTC-3) Brasília" },
    { value: "America/New_York", label: "(UTC-5) New York" },
    { value: "Europe/London", label: "(UTC+0) London" },
    { value: "Europe/Paris", label: "(UTC+1) Paris" },
    { value: "Asia/Tokyo", label: "(UTC+9) Tokyo" },
  ];

  const themes = [
    { value: "light", label: "Claro", description: "Tema com fundo claro" },
    { value: "dark", label: "Escuro", description: "Tema com fundo escuro" },
    { value: "auto", label: "Automático", description: "Segue o sistema" },
  ];

  const currencies = [
    { value: "BRL", label: "Real Brasileiro (R$)" },
    { value: "USD", label: "Dólar Americano ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "Libra Esterlina (£)" },
  ];

  const handlePreferenceChange = (field: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Preferências atualizadas com sucesso!");
    } catch (err) {
      success("Erro ao atualizar preferências.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Preferências"
      description="Configure o idioma, fuso horário e outras preferências"
      icon={Globe}
    >
      {/* Idioma */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Globe className="inline h-4 w-4 mr-2" />
          Idioma
        </label>
        <select
          value={preferences.language}
          onChange={(e) => handlePreferenceChange("language", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fuso Horário */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Clock className="inline h-4 w-4 mr-2" />
          Fuso Horário
        </label>
        <select
          value={preferences.timezone}
          onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tema */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          <Palette className="inline h-4 w-4 mr-2" />
          Tema da Interface
        </label>
        <div className="space-y-2">
          {themes.map((theme) => (
            <label
              key={theme.value}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="theme"
                value={theme.value}
                checked={preferences.theme === theme.value}
                onChange={(e) =>
                  handlePreferenceChange("theme", e.target.value)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {theme.label}
                </div>
                <div className="text-sm text-gray-600">{theme.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Moeda */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Moeda Padrão
        </label>
        <select
          value={preferences.currency}
          onChange={(e) => handlePreferenceChange("currency", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {currencies.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          loading={isLoading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Preferências
        </Button>
      </div>
    </SettingsSection>
  );
}
