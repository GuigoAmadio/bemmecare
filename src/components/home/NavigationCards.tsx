"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  User,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

interface NavigationCardsProps {
  className?: string;
}

export default function NavigationCards({
  className = "",
}: NavigationCardsProps) {
  const cards = [
    {
      title: "Blog",
      description:
        "Dicas, tutoriais e novidades sobre cuidados naturais e bem-estar",
      icon: BookOpen,
      href: "/blog",
      color: "from-primary/20 to-primary-light/20",
      iconColor: "text-primary",
      hoverColor: "hover:from-primary/30 hover:to-primary-light/30",
    },
    {
      title: "Catálogos",
      description:
        "Explore nossa coleção completa de produtos organizados por categoria",
      icon: FileText,
      href: "/catalogos",
      color: "from-accent/20 to-accent-light/20",
      iconColor: "text-accent",
      hoverColor: "hover:from-accent/30 hover:to-accent-light/30",
    },
    {
      title: "Quem Somos",
      description:
        "Conheça nossa história, missão e valores que nos guiam todos os dias",
      icon: User,
      href: "/sobre-nos",
      color: "from-success/20 to-primary/20",
      iconColor: "text-success",
      hoverColor: "hover:from-success/30 hover:to-primary/30",
    },
    {
      title: "Falar no WhatsApp",
      description:
        "Tire suas dúvidas e receba atendimento personalizado via WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/5511999999999",
      color: "from-warning/20 to-accent/20",
      iconColor: "text-warning",
      hoverColor: "hover:from-warning/30 hover:to-accent/30",
      external: true,
    },
  ];

  return (
    <section
      className={`py-24 bg-gradient-to-b from-background-secondary to-background ${className}`}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 font-heading">
            Explore mais da{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BemmeCare
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Descubra todos os recursos e informações que preparamos
            especialmente para você
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto place-items-center max-w-5xl">
          {cards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              target={card.external ? "_blank" : "_self"}
              rel={card.external ? "noopener noreferrer" : undefined}
              className="group block"
            >
              <div
                className={`
                relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50
                hover:shadow-2xl hover:border-primary/20 transform hover:-translate-y-2
                transition-all duration-300 h-full 
              `}
              >
                {/* Background Gradient */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br ${card.color} ${card.hoverColor}
                  rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex w-full justify-between items-start gap-4 mb-4">
                    <div className="flex gap-4 items-center">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                      </div>
                      {/* Title */}
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Saiba mais</span>
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  </div>
                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-accent/10 to-success/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
            <span className="text-text-primary font-semibold">
              Precisa de ajuda? Nossa equipe está sempre pronta para te atender
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
