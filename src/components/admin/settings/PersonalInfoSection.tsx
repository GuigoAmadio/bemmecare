"use client";

import { useState } from "react";
import { User, Camera, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SettingsSection from "./SettingsSection";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

export default function PersonalInfoSection() {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Informações pessoais atualizadas com sucesso!");
    } catch (err) {
      error("Erro ao atualizar informações pessoais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    // Implementar upload de foto
    success("Funcionalidade de upload de foto será implementada em breve!");
  };

  return (
    <SettingsSection
      title="Informações Pessoais"
      description="Gerencie suas informações básicas de perfil"
      icon={User}
    >
      {/* Foto de Perfil */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.name?.[0] || "A"}
            </span>
          </div>
          <button
            onClick={handlePhotoUpload}
            className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Camera className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Foto de Perfil</h4>
          <p className="text-sm text-gray-600 mt-1">
            Clique no ícone da câmera para alterar sua foto
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          placeholder="Seu primeiro nome"
        />
      </div>

      <Input
        label="E-mail"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        placeholder="seu@email.com"
      />

      <Input
        label="Telefone"
        type="tel"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        placeholder="(XX) XXXXX-XXXX"
      />

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          loading={isLoading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </SettingsSection>
  );
}
