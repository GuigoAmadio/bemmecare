"use client";

import { useState } from "react";
import { Store, Globe, MapPin, Phone, Mail, Save, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SettingsSection from "./SettingsSection";
import { useNotification } from "@/context/NotificationContext";

export default function StoreConfigSection() {
  const { success, error } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    name: "BemmeCare",
    description: "Sua loja online de confiança",
    email: "contato@bemmecare.com",
    phone: "(11) 99999-0000",
    website: "https://bemmecare.com",
    address: {
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
    },
    business: {
      cnpj: "12.345.678/0001-90",
      razaoSocial: "BemmeCare Comércio Eletrônico Ltda",
      inscricaoEstadual: "123.456.789.012",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setStoreData((prev) => {
        const parentObj = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(typeof parentObj === "object" && parentObj !== null
              ? parentObj
              : {}),
            [child]: value,
          },
        };
      });
    } else {
      setStoreData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      success("Configurações da loja atualizadas com sucesso!");
    } catch (err) {
      error("Erro ao atualizar configurações da loja.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = () => {
    success("Funcionalidade de upload de logo será implementada em breve!");
  };

  return (
    <SettingsSection
      title="Configurações da Loja"
      description="Gerencie as informações da sua loja"
      icon={Store}
    >
      {/* Logo da Loja */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Store className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Logo da Loja</h4>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              Recomendado: 400x400px, formato PNG ou JPG
            </p>
            <Button onClick={handleLogoUpload} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Alterar Logo
            </Button>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Store className="h-4 w-4" />
          Informações Básicas
        </h4>

        <Input
          label="Nome da Loja"
          value={storeData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Nome da sua loja"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Descrição da Loja
          </label>
          <textarea
            value={storeData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Descreva sua loja..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Contato */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Informações de Contato
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="E-mail"
            type="email"
            value={storeData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="contato@loja.com"
            icon={<Mail className="h-4 w-4" />}
          />

          <Input
            label="Telefone"
            type="tel"
            value={storeData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
            icon={<Phone className="h-4 w-4" />}
          />
        </div>

        <Input
          label="Website"
          type="url"
          value={storeData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://minhaloja.com"
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Endereço da Empresa
        </h4>

        <Input
          label="Endereço"
          value={storeData.address.street}
          onChange={(e) => handleInputChange("address.street", e.target.value)}
          placeholder="Rua, número, complemento"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Cidade"
            value={storeData.address.city}
            onChange={(e) => handleInputChange("address.city", e.target.value)}
            placeholder="Cidade"
          />

          <Input
            label="Estado"
            value={storeData.address.state}
            onChange={(e) => handleInputChange("address.state", e.target.value)}
            placeholder="UF"
            maxLength={2}
          />

          <Input
            label="CEP"
            value={storeData.address.zipCode}
            onChange={(e) =>
              handleInputChange("address.zipCode", e.target.value)
            }
            placeholder="00000-000"
          />
        </div>

        <Input
          label="País"
          value={storeData.address.country}
          onChange={(e) => handleInputChange("address.country", e.target.value)}
          placeholder="País"
        />
      </div>

      {/* Informações Empresariais */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Informações Empresariais</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CNPJ"
            value={storeData.business.cnpj}
            onChange={(e) => handleInputChange("business.cnpj", e.target.value)}
            placeholder="00.000.000/0000-00"
          />

          <Input
            label="Inscrição Estadual"
            value={storeData.business.inscricaoEstadual}
            onChange={(e) =>
              handleInputChange("business.inscricaoEstadual", e.target.value)
            }
            placeholder="000.000.000.000"
          />
        </div>

        <Input
          label="Razão Social"
          value={storeData.business.razaoSocial}
          onChange={(e) =>
            handleInputChange("business.razaoSocial", e.target.value)
          }
          placeholder="Nome da empresa"
        />
      </div>

      {/* Configurações Avançadas */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-3">
          Configurações Avançadas
        </h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-blue-700">
              Permitir cadastro de novos clientes
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-blue-700">
              Exibir preços com impostos inclusos
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-blue-700">
              Modo de manutenção
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          loading={isLoading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </SettingsSection>
  );
}
