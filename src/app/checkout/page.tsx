"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ShoppingBag,
  Truck,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CheckoutLoading from "@/components/checkout/CheckoutLoading";
import { useCart } from "@/context/CartContext";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface PaymentMethod {
  type: "credit" | "debit" | "pix" | "boleto";
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  installments: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "credit",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    installments: 1,
  });

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/carrinho");
    }
  }, [cart.items.length, router]);

  const handleZipCodeChange = async (zipCode: string) => {
    setShippingAddress((prev) => ({ ...prev, zipCode }));

    if (zipCode.replace(/\D/g, "").length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${zipCode}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setShippingAddress((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.firstName) newErrors.firstName = "Nome é obrigatório";
    if (!shippingAddress.lastName)
      newErrors.lastName = "Sobrenome é obrigatório";
    if (!shippingAddress.email) newErrors.email = "Email é obrigatório";
    if (!shippingAddress.phone) newErrors.phone = "Telefone é obrigatório";
    if (!shippingAddress.zipCode) newErrors.zipCode = "CEP é obrigatório";
    if (!shippingAddress.street) newErrors.street = "Endereço é obrigatório";
    if (!shippingAddress.number) newErrors.number = "Número é obrigatório";
    if (!shippingAddress.neighborhood)
      newErrors.neighborhood = "Bairro é obrigatório";
    if (!shippingAddress.city) newErrors.city = "Cidade é obrigatória";
    if (!shippingAddress.state) newErrors.state = "Estado é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod.type === "credit" || paymentMethod.type === "debit") {
      if (!paymentMethod.cardNumber)
        newErrors.cardNumber = "Número do cartão é obrigatório";
      if (!paymentMethod.cardName)
        newErrors.cardName = "Nome no cartão é obrigatório";
      if (!paymentMethod.expiryDate)
        newErrors.expiryDate = "Data de validade é obrigatória";
      if (!paymentMethod.cvv) newErrors.cvv = "CVV é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishOrder = async () => {
    setIsProcessing(true);

    try {
      // Simular processamento do pedido
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simular chance de erro (10%)
      if (Math.random() < 0.1) {
        throw new Error("Erro no pagamento");
      }

      // Limpar carrinho
      clearCart();

      // Redirecionar para página de sucesso
      const orderId = "BM-" + Date.now().toString().slice(-6);
      router.push(`/checkout/sucesso?order=${orderId}`);
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      router.push("/checkout/erro?type=payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 5);
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})/, "$1-$2")
      .slice(0, 15);
  };

  if (cart.items.length === 0) {
    return null; // Vai redirecionar
  }

  return (
    <>
      <CheckoutLoading isVisible={isProcessing} />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/carrinho"
              className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Carrinho
            </Link>

            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Finalizar Compra
            </h1>

            {/* Steps Indicator */}
            <div className="flex items-center space-x-4 mb-8">
              {[
                {
                  step: 1,
                  title: "Entrega",
                  icon: <MapPin className="h-4 w-4" />,
                },
                {
                  step: 2,
                  title: "Pagamento",
                  icon: <CreditCard className="h-4 w-4" />,
                },
                {
                  step: 3,
                  title: "Confirmação",
                  icon: <CheckCircle className="h-4 w-4" />,
                },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= item.step
                        ? "bg-primary border-primary text-white"
                        : "border-border text-text-muted"
                    }`}
                  >
                    {currentStep > item.step ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      currentStep >= item.step
                        ? "text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    {item.title}
                  </span>
                  {index < 2 && (
                    <div
                      className={`w-12 h-0.5 mx-4 transition-all duration-300 ${
                        currentStep > item.step ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Informações de Entrega */}
              {currentStep === 1 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Informações de Entrega
                  </h2>

                  <div className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.firstName}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.firstName ? "border-error" : "border-border"
                          }`}
                          placeholder="Seu nome"
                        />
                        {errors.firstName && (
                          <p className="text-error text-sm mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Sobrenome *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.lastName}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.lastName ? "border-error" : "border-border"
                          }`}
                          placeholder="Seu sobrenome"
                        />
                        {errors.lastName && (
                          <p className="text-error text-sm mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.email ? "border-error" : "border-border"
                          }`}
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="text-error text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              phone: formatPhone(e.target.value),
                            }))
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.phone ? "border-error" : "border-border"
                          }`}
                          placeholder="(11) 99999-9999"
                        />
                        {errors.phone && (
                          <p className="text-error text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Endereço */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-medium text-text-primary mb-4">
                        Endereço de Entrega
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            CEP *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.zipCode}
                            onChange={(e) =>
                              handleZipCodeChange(formatZipCode(e.target.value))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.zipCode ? "border-error" : "border-border"
                            }`}
                            placeholder="00000-000"
                          />
                          {errors.zipCode && (
                            <p className="text-error text-sm mt-1">
                              {errors.zipCode}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Endereço *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.street}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.street ? "border-error" : "border-border"
                            }`}
                            placeholder="Rua, Avenida, etc."
                          />
                          {errors.street && (
                            <p className="text-error text-sm mt-1">
                              {errors.street}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Número *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.number}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                number: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.number ? "border-error" : "border-border"
                            }`}
                            placeholder="123"
                          />
                          {errors.number && (
                            <p className="text-error text-sm mt-1">
                              {errors.number}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Complemento
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.complement}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                complement: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Apartamento, bloco, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Bairro *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.neighborhood}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                neighborhood: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.neighborhood
                                ? "border-error"
                                : "border-border"
                            }`}
                            placeholder="Nome do bairro"
                          />
                          {errors.neighborhood && (
                            <p className="text-error text-sm mt-1">
                              {errors.neighborhood}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.city ? "border-error" : "border-border"
                            }`}
                            placeholder="Nome da cidade"
                          />
                          {errors.city && (
                            <p className="text-error text-sm mt-1">
                              {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Estado *
                          </label>
                          <select
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.state ? "border-error" : "border-border"
                            }`}
                          >
                            <option value="">Selecione</option>
                            <option value="SP">São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="RS">Rio Grande do Sul</option>
                            {/* Adicionar outros estados */}
                          </select>
                          {errors.state && (
                            <p className="text-error text-sm mt-1">
                              {errors.state}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 2: Método de Pagamento */}
              {currentStep === 2 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Método de Pagamento
                  </h2>

                  <div className="space-y-6">
                    {/* Seleção do Método */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          type: "credit",
                          label: "Cartão de Crédito",
                          icon: <CreditCard className="h-5 w-5" />,
                        },
                        {
                          type: "debit",
                          label: "Cartão de Débito",
                          icon: <CreditCard className="h-5 w-5" />,
                        },
                        {
                          type: "pix",
                          label: "PIX",
                          icon: <Phone className="h-5 w-5" />,
                        },
                        {
                          type: "boleto",
                          label: "Boleto",
                          icon: <Calendar className="h-5 w-5" />,
                        },
                      ].map((method) => (
                        <button
                          key={method.type}
                          onClick={() =>
                            setPaymentMethod((prev) => ({
                              ...prev,
                              type: method.type as any,
                            }))
                          }
                          className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                            paymentMethod.type === method.type
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {method.icon}
                            <span className="text-sm font-medium">
                              {method.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Formulário do Cartão */}
                    {(paymentMethod.type === "credit" ||
                      paymentMethod.type === "debit") && (
                      <div className="border-t border-border pt-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Número do Cartão *
                          </label>
                          <input
                            type="text"
                            value={paymentMethod.cardNumber}
                            onChange={(e) =>
                              setPaymentMethod((prev) => ({
                                ...prev,
                                cardNumber: formatCardNumber(e.target.value),
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.cardNumber
                                ? "border-error"
                                : "border-border"
                            }`}
                            placeholder="0000 0000 0000 0000"
                          />
                          {errors.cardNumber && (
                            <p className="text-error text-sm mt-1">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Nome no Cartão *
                          </label>
                          <input
                            type="text"
                            value={paymentMethod.cardName}
                            onChange={(e) =>
                              setPaymentMethod((prev) => ({
                                ...prev,
                                cardName: e.target.value.toUpperCase(),
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.cardName ? "border-error" : "border-border"
                            }`}
                            placeholder="NOME COMO NO CARTÃO"
                          />
                          {errors.cardName && (
                            <p className="text-error text-sm mt-1">
                              {errors.cardName}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              Validade *
                            </label>
                            <input
                              type="text"
                              value={paymentMethod.expiryDate}
                              onChange={(e) =>
                                setPaymentMethod((prev) => ({
                                  ...prev,
                                  expiryDate: formatExpiryDate(e.target.value),
                                }))
                              }
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.expiryDate
                                  ? "border-error"
                                  : "border-border"
                              }`}
                              placeholder="MM/AA"
                            />
                            {errors.expiryDate && (
                              <p className="text-error text-sm mt-1">
                                {errors.expiryDate}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              value={paymentMethod.cvv}
                              onChange={(e) =>
                                setPaymentMethod((prev) => ({
                                  ...prev,
                                  cvv: e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 4),
                                }))
                              }
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.cvv ? "border-error" : "border-border"
                              }`}
                              placeholder="123"
                            />
                            {errors.cvv && (
                              <p className="text-error text-sm mt-1">
                                {errors.cvv}
                              </p>
                            )}
                          </div>
                        </div>

                        {paymentMethod.type === "credit" && (
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              Parcelas
                            </label>
                            <select
                              value={paymentMethod.installments}
                              onChange={(e) =>
                                setPaymentMethod((prev) => ({
                                  ...prev,
                                  installments: parseInt(e.target.value),
                                }))
                              }
                              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value={1}>
                                1x de R$ {cart.total.toFixed(2)} sem juros
                              </option>
                              <option value={2}>
                                2x de R$ {(cart.total / 2).toFixed(2)} sem juros
                              </option>
                              <option value={3}>
                                3x de R$ {(cart.total / 3).toFixed(2)} sem juros
                              </option>
                              <option value={6}>
                                6x de R$ {(cart.total / 6).toFixed(2)} sem juros
                              </option>
                              <option value={12}>
                                12x de R$ {(cart.total / 12).toFixed(2)} sem
                                juros
                              </option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PIX */}
                    {paymentMethod.type === "pix" && (
                      <div className="border-t border-border pt-6">
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-primary mb-2">
                                Pagamento via PIX
                              </p>
                              <p className="text-sm text-text-secondary">
                                Após confirmar o pedido, você receberá um código
                                PIX para pagamento. O pedido será processado
                                automaticamente após a confirmação do pagamento.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Boleto */}
                    {paymentMethod.type === "boleto" && (
                      <div className="border-t border-border pt-6">
                        <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-warning mb-2">
                                Pagamento via Boleto
                              </p>
                              <p className="text-sm text-text-secondary">
                                O boleto vence em 3 dias úteis. Após o
                                pagamento, o pedido será processado em até 2
                                dias úteis.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Step 3: Confirmação */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Resumo da Entrega */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Entrega
                    </h3>
                    <div className="text-text-secondary">
                      <p className="font-medium">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p>
                        {shippingAddress.street}, {shippingAddress.number}
                      </p>
                      {shippingAddress.complement && (
                        <p>{shippingAddress.complement}</p>
                      )}
                      <p>{shippingAddress.neighborhood}</p>
                      <p>
                        {shippingAddress.city} - {shippingAddress.state}
                      </p>
                      <p>CEP: {shippingAddress.zipCode}</p>
                      <p className="mt-2">📧 {shippingAddress.email}</p>
                      <p>📱 {shippingAddress.phone}</p>
                    </div>
                  </Card>

                  {/* Resumo do Pagamento */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      Pagamento
                    </h3>
                    <div className="text-text-secondary">
                      {paymentMethod.type === "credit" && (
                        <>
                          <p className="font-medium">Cartão de Crédito</p>
                          <p>
                            **** **** **** {paymentMethod.cardNumber.slice(-4)}
                          </p>
                          <p>{paymentMethod.cardName}</p>
                          <p>
                            {paymentMethod.installments}x de R${" "}
                            {(cart.total / paymentMethod.installments).toFixed(
                              2
                            )}
                          </p>
                        </>
                      )}
                      {paymentMethod.type === "debit" && (
                        <>
                          <p className="font-medium">Cartão de Débito</p>
                          <p>
                            **** **** **** {paymentMethod.cardNumber.slice(-4)}
                          </p>
                          <p>{paymentMethod.cardName}</p>
                        </>
                      )}
                      {paymentMethod.type === "pix" && (
                        <p className="font-medium">
                          PIX - Pagamento instantâneo
                        </p>
                      )}
                      {paymentMethod.type === "boleto" && (
                        <p className="font-medium">
                          Boleto Bancário - Vencimento em 3 dias
                        </p>
                      )}
                    </div>
                  </Card>

                  {/* Termos e Condições */}
                  <Card className="p-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-text-secondary"
                      >
                        Li e concordo com os{" "}
                        <Link
                          href="/termos"
                          className="text-primary hover:underline"
                        >
                          Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link
                          href="/privacidade"
                          className="text-primary hover:underline"
                        >
                          Política de Privacidade
                        </Link>
                      </label>
                    </div>
                  </Card>
                </div>
              )}

              {/* Botões de Navegação */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="px-8"
                  >
                    Voltar
                  </Button>
                )}

                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <Button
                      onClick={handleNextStep}
                      variant="primary"
                      className="px-8"
                    >
                      Continuar
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinishOrder}
                      loading={isProcessing}
                      variant="primary"
                      className="px-8 bg-gradient-to-r from-primary to-primary-light"
                      disabled={isProcessing}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {isProcessing ? "Processando..." : "Finalizar Pedido"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  Resumo do Pedido
                </h3>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-background-secondary rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-text-secondary text-xs">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-primary text-sm">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>R$ {cart.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-text-secondary">
                    <span>Frete</span>
                    <span>
                      {cart.shipping === 0 ? (
                        <span className="text-success font-semibold">
                          Grátis
                        </span>
                      ) : (
                        `R$ ${cart.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Desconto</span>
                      <span>-R$ {cart.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <hr className="border-border" />

                  <div className="flex justify-between text-xl font-bold text-text-primary">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {cart.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Informações de Segurança */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-success text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm mt-2">
                    <Truck className="h-4 w-4" />
                    <span>Frete grátis acima de R$ 100</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
