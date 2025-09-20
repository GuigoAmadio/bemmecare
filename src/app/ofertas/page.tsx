"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  Clock,
  Zap,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";

// Mock data para ofertas
const weeklyOffers = [
  {
    id: "1",
    name: "Óleo Essencial de Lavanda Premium",
    description:
      "Óleo essencial puro de lavanda francesa, perfeito para relaxamento",
    price: 29.9,
    oldPrice: 59.9,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&crop=center",
    category: "Óleos Essenciais",
    rating: 4.9,
    reviewCount: 156,
    stock: 12,
    discount: 50,
    isHighlight: false,
  },
  {
    id: "2",
    name: "Kit Completo Aromaterapia",
    description: "Kit com 5 óleos essenciais + difusor aromático premium",
    price: 89.9,
    oldPrice: 179.9,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop&crop=center",
    category: "Kits Especiais",
    rating: 4.8,
    reviewCount: 203,
    stock: 8,
    discount: 50,
    isHighlight: true, // Produto central destacado
  },
  {
    id: "3",
    name: "Creme Hidratante Natural",
    description:
      "Creme com ingredientes 100% naturais para todos os tipos de pele",
    price: 24.9,
    oldPrice: 42.9,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&crop=center",
    category: "Cuidados com a Pele",
    rating: 4.7,
    reviewCount: 89,
    stock: 15,
    discount: 42,
    isHighlight: false,
  },
];

const featuredProduct = {
  id: "4",
  name: "Sérum Anti-Idade Orgânico",
  description:
    "Fórmula exclusiva com ácido hialurônico e vitamina C natural. Reduz linhas de expressão e proporciona hidratação profunda para uma pele mais jovem e radiante.",
  price: 67.9,
  oldPrice: 129.9,
  image:
    "https://images.unsplash.com/photo-1556228453-5b3bbaa7b5c3?w=800&h=800&fit=crop&crop=center",
  category: "Produtos Premium",
  rating: 4.9,
  reviewCount: 312,
  stock: 6,
  discount: 48,
  features: [
    "Ácido Hialurônico Natural",
    "Vitamina C Concentrada",
    "Certificação Orgânica",
    "Testado Dermatologicamente",
  ],
};

export default function OffersPage() {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  const handleToggleFavorite = (productId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (favorites.includes(productId)) {
      newFavorites = favorites.filter((id: string) => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5e7] via-background to-[#f5fbe0]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
              <Flame className="h-4 w-4" />
              OFERTAS DA SEMANA
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4 leading-tight">
              Promoções{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Imperdíveis
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Descontos de até <strong className="text-primary">50%</strong> em
              produtos selecionados. Ofertas por tempo limitado!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center mb-16">
            <Card className="p-6 bg-gradient-to-r from-error/10 to-warning/10 border-2 border-error/20">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Clock className="h-5 w-5 text-error animate-pulse" />
                <span className="font-semibold text-error">
                  Oferta termina em:
                </span>
              </div>
              <div className="flex gap-4 text-center">
                {[
                  { label: "Dias", value: timeLeft.days },
                  { label: "Horas", value: timeLeft.hours },
                  { label: "Min", value: timeLeft.minutes },
                  { label: "Seg", value: timeLeft.seconds },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="bg-error text-white rounded-lg px-3 py-2 font-bold text-xl min-w-[50px]">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <span className="text-xs text-text-muted mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Ofertas Principais - 3 Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {weeklyOffers.map((product, index) => (
              <div key={product.id} className="relative">
                {/* Luz de fundo para destaque */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                    product.isHighlight
                      ? "bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 shadow-2xl shadow-primary/20 scale-105 animate-pulse"
                      : "bg-gradient-to-br from-primary/10 to-accent/10 shadow-xl hover:shadow-2xl hover:scale-102"
                  } blur-sm`}
                ></div>

                <Card
                  className={`relative p-8 transition-all duration-500 hover:-translate-y-2 ${
                    product.isHighlight
                      ? "scale-110 z-10 border-2 border-primary/30"
                      : "hover:scale-105"
                  }`}
                >
                  {/* Badge de Desconto */}
                  <div className="absolute -top-4 -right-4 z-20">
                    <div className="bg-gradient-to-r from-error to-warning text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg transform rotate-12">
                      -{product.discount}%
                    </div>
                  </div>

                  {/* Badge de Destaque */}
                  {product.isHighlight && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        MAIS VENDIDO
                      </div>
                    </div>
                  )}

                  {/* Imagem do Produto */}
                  <div
                    className={`relative mb-6 overflow-hidden rounded-2xl ${
                      product.isHighlight ? "h-80" : "h-64"
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Botão de Favorito */}
                    <button
                      onClick={() => handleToggleFavorite(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300"
                    >
                      <Heart className="h-4 w-4 text-text-muted hover:text-error" />
                    </button>
                  </div>

                  {/* Informações do Produto */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                        {product.category}
                      </p>
                      <h3
                        className={`font-bold text-text-primary leading-tight ${
                          product.isHighlight ? "text-xl" : "text-lg"
                        }`}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= product.rating
                                ? "text-warning fill-current"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-text-secondary">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Preços */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-bold text-primary ${
                            product.isHighlight ? "text-3xl" : "text-2xl"
                          }`}
                        >
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-text-muted line-through">
                          R$ {product.oldPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-success font-semibold text-sm">
                        Economia de R${" "}
                        {(product.oldPrice - product.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Estoque */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                      <span className="text-sm text-warning font-medium">
                        Restam apenas {product.stock} unidades!
                      </span>
                    </div>

                    {/* Botão de Compra */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="primary"
                      fullWidth
                      className={`bg-gradient-to-r from-primary to-primary-light hover:shadow-xl transition-all duration-300 ${
                        product.isHighlight ? "py-4 text-lg font-bold" : "py-3"
                      }`}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Produto em Destaque Solo */}
      <div className="bg-gradient-to-r from-background-secondary via-background to-background-secondary py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Badge de Destaque */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-warning to-error text-white px-6 py-2 rounded-full font-semibold shadow-lg">
              <Sparkles className="h-4 w-4" />
              PRODUTO PREMIUM EM DESTAQUE
              <Flame className="h-4 w-4" />
            </div>
          </div>

          <div className="text-center">
            {/* Imagem do Produto */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              {/* Efeito de brilho atrás */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 rounded-full blur-3xl scale-110 animate-pulse"></div>

              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  sizes="320px"
                />
              </div>

              {/* Badge de desconto flutuante */}
              <div className="absolute -top-4 -right-4 z-10">
                <div className="bg-gradient-to-r from-error to-warning text-white rounded-full w-20 h-20 flex items-center justify-center font-bold text-lg shadow-xl animate-bounce">
                  -{featuredProduct.discount}%
                </div>
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">
                  {featuredProduct.category}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
                  {featuredProduct.name}
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                  {featuredProduct.description}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-4">
                {featuredProduct.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= featuredProduct.rating
                          ? "text-warning fill-current"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-text-primary">
                  {featuredProduct.rating}
                </span>
                <span className="text-text-secondary">
                  ({featuredProduct.reviewCount} avaliações)
                </span>
              </div>

              {/* Preços */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl font-bold text-primary">
                    R$ {featuredProduct.price.toFixed(2)}
                  </span>
                  <span className="text-2xl text-text-muted line-through">
                    R$ {featuredProduct.oldPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-success font-bold text-xl">
                  Você economiza R${" "}
                  {(featuredProduct.oldPrice - featuredProduct.price).toFixed(
                    2
                  )}
                  !
                </p>
              </div>

              {/* Estoque crítico */}
              <div className="bg-warning/10 border-2 border-warning/30 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-warning">
                  <Clock className="h-5 w-5 animate-pulse" />
                  <span className="font-semibold">
                    ÚLTIMAS {featuredProduct.stock} UNIDADES!
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                  onClick={() => handleAddToCart(featuredProduct)}
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-light hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Comprar Agora
                </Button>

                <Link href={`/catalogo/produto/${featuredProduct.id}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            Não Perca Essas Ofertas Exclusivas!
          </h3>
          <p className="text-lg text-text-secondary mb-8">
            Promoções válidas por tempo limitado ou enquanto durarem os
            estoques.
          </p>
          <Link href="/catalogo">
            <Button
              size="lg"
              variant="primary"
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Ver Mais Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
