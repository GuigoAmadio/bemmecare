"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Bem-vindo à",
      brand: "BemmeCare",
      subtitle:
        "Descubra os melhores produtos com qualidade garantida e entrega rápida. Sua experiência de compra online perfeita começa aqui.",
      cta: "Explorar Produtos",
      ctaSecondary: "Meus Favoritos",
      background: "from-primary/5 via-accent/5 to-background",
      badge: "✨ Mais de 10.000 produtos disponíveis",
    },
    {
      title: "Ingredientes",
      brand: "100% Naturais",
      subtitle:
        "Produtos cuidadosamente selecionados com ingredientes naturais e óleos essenciais que fazem bem para sua saúde e bem-estar.",
      cta: "Ver Catálogo",
      ctaSecondary: "Sobre Nós",
      background: "from-accent/5 via-primary/5 to-background",
      badge: "🌿 Ingredientes naturais certificados",
    },
    {
      title: "Entrega",
      brand: "Rápida e Segura",
      subtitle:
        "Receba seus produtos em casa com frete grátis para compras acima de R$ 100. Entrega em todo o Brasil com segurança garantida.",
      cta: "Comprar Agora",
      ctaSecondary: "Rastrear Pedido",
      background: "from-success/5 via-accent/5 to-background",
      badge: "🚚 Frete grátis acima de R$ 100",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className={`relative bg-gradient-to-br from-[#fff5e7] to-[#f5fbe0] min-h-screen flex items-center overflow-hidden ${className}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 transition-all duration-1000`}>
        {/* Floating Elements */}
        <div className="absolute top-12 left-6 w-40 h-40 bg-primary/20 opacity-50 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/30 rounded-full blur-xl animate-pulse"></div>

        {/* Folhas decorativas */}
        {/* Folha decorativa SVG importada diretamente */}
        <div className="absolute top-1/3 right-0 w-80 select-none flex items-start justify-end">
          <img
            src="/fundo/folha1.svg"
            alt=""
            className="w-full h-full object-contain"
            draggable={false}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-6xl font-bold text-text-primary mb-8 leading-tight animate-fade-in-up">
            {currentSlideData.title}{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-heading">
              {currentSlideData.brand}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            {currentSlideData.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up">
            <Link href="/catalogo">
              <Button
                size="lg"
                variant="primary"
                className="bg-gradient-to-r from-primary to-primary-light hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-xl group hover:cursor-pointer"
              >
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                {currentSlideData.cta}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/favoritos">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transform hover:scale-105 hover:text-primary transition-all duration-300 backdrop-blur-sm group hover:cursor-pointer"
              >
                <Heart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {currentSlideData.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up py-10">
            <div className="">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-xl font-bold text-text-primary mb-2">
                50k+
              </div>
              <div className="text-text-secondary font-medium">
                Clientes Satisfeitos
              </div>
            </div>

            <div className="">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="text-xl font-bold text-text-primary mb-2">
                99.8%
              </div>
              <div className="text-text-secondary font-medium">
                Taxa de Satisfação
              </div>
            </div>

            <div className="">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent/20 to-warning/20 rounded-2xl mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <div className="text-xl font-bold text-text-primary mb-2">
                24h
              </div>
              <div className="text-text-secondary font-medium">
                Entrega Expressa
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
