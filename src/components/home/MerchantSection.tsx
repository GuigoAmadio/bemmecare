"use client";

import {
  Leaf,
  Droplets,
  Shield,
  Heart,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

interface MerchantSectionProps {
  className?: string;
}

export default function MerchantSection({
  className = "",
}: MerchantSectionProps) {
  const features = [
    {
      icon: Leaf,
      title: "Ingredientes Naturais",
      description:
        "Selecionamos apenas os melhores ingredientes naturais, livres de químicos agressivos e conservantes artificiais.",
      color: "from-success/20 to-primary/20",
    },
    {
      icon: Droplets,
      title: "Óleos Essenciais",
      description:
        "Nossos produtos são enriquecidos com óleos essenciais puros que proporcionam benefícios terapêuticos únicos.",
      color: "from-primary/20 to-accent/20",
    },
    {
      icon: Shield,
      title: "Certificação Orgânica",
      description:
        "Todos os nossos ingredientes são certificados organicamente, garantindo qualidade e sustentabilidade.",
      color: "from-accent/20 to-success/20",
    },
    {
      icon: Heart,
      title: "Bem-estar Garantido",
      description:
        "Cada produto é desenvolvido pensando no seu bem-estar e na saúde da sua pele e cabelo.",
      color: "from-warning/20 to-primary/20",
    },
  ];

  const benefits = [
    "Livres de parabenos e sulfatos",
    "Não testados em animais",
    "Embalagens sustentáveis",
    "Fórmulas dermatologicamente testadas",
    "Adequados para todos os tipos de pele",
    "Resultados visíveis em 30 dias",
  ];

  return (
    <section
      className={`py-24 bg-gradient-to-b from-background to-background-secondary relative overflow-hidden ${className}`}
    >
      {/* Folhas decorativas */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-folha1 bg-no-repeat bg-right-top bg-contain opacity-40"></div>
      <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-folha2 bg-no-repeat bg-left-top bg-contain opacity-40"></div>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold text-sm">
              🌿 Nossa Filosofia Natural
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 font-heading">
            Ingredientes que fazem a{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              diferença
            </span>
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Na BemmeCare, acreditamos que a beleza verdadeira vem da natureza.
            Por isso, desenvolvemos produtos com ingredientes cuidadosamente
            selecionados que nutrem, protegem e revitalizam sua pele e cabelo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
