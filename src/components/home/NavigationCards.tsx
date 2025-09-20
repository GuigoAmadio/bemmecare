"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  User,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  MessageSquare,
} from "lucide-react";

interface NavigationCardsProps {
  className?: string;
}

export default function NavigationCards({
  className = "",
}: NavigationCardsProps) {
  const renderIcon = (icon: any, iconColor: string, size: string) => {
    const IconComponent = icon;
    return (
      <IconComponent
        className={`${size} ${iconColor} group-hover:scale-110 transition-transform duration-300`}
      />
    );
  };
  const cards = [
    {
      title: "Blog",
      description:
        "Dicas, tutoriais e novidades sobre cuidados naturais e bem-estar",
      icon: Sparkles,
      href: "/blog",
      color: "from-yellow-100/40 to-yellow-200/40",
      iconColor: "text-yellow-600",
      hoverColor: "hover:from-yellow-200 hover:to-yellow-300",
    },
    {
      title: "Catálogos",
      description:
        "Explore nossa coleção completa de produtos organizados por categoria",
      icon: Heart,
      href: "/catalogos",
      color: "from-rose-100/40 to-rose-200/40",
      iconColor: "text-pink-600",
      hoverColor: "hover:from-red-300 hover:to-rose-300",
    },
    {
      title: "Quem Somos",
      description:
        "Conheça nossa história, missão e valores que nos guiam todos os dias",
      icon: Users,
      href: "/sobre-nos",
      color: "from-amber-100/40 to-amber-200/40",
      iconColor: "text-amber-600",
      hoverColor: "hover:from-amber-200 hover:to-amber-300",
    },
    {
      title: "WhatsApp",
      description:
        "Tire suas dúvidas e receba atendimento personalizado via WhatsApp",
      icon: MessageSquare,
      href: "https://wa.me/5511999999999",
      color: "from-green-100 to-emerald-200",
      iconColor: "text-green-600",
      hoverColor: "hover:from-green-200 hover:to-emerald-300",
      external: true,
    },
  ];

  return (
    <section
      className={`py-24 bg-gradient-to-b from-background-secondary to-background ${className}`}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
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

        {/* Navigation Balls - Half Moon Layout */}
        <div className="flex items-center justify-center space-x-4 md:space-x-16">
          {/* Left corner ball - positioned higher */}
          <Link
            href={cards[0].href}
            target={cards[0].external ? "_blank" : "_self"}
            rel={cards[0].external ? "noopener noreferrer" : undefined}
            className="group relative transform -translate-y-4 md:-translate-y-12"
          >
            <div
              className={`
              relative w-28 h-28 md:w-44 md:h-44 rounded-full bg-gradient-to-br ${cards[0].color} 
              border-3 shadow-2xl backdrop-blur-sm
              group-hover:scale-110 group-hover:shadow-3xl group-hover:rotate-6
              transition-all duration-500 ease-out cursor-pointer
              border-yellow-300
            `}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/50 to-yellow-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>

              {/* Content inside ball */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* Icon */}
                <div className="mb-2">
                  {renderIcon(
                    cards[0].icon,
                    cards[0].iconColor,
                    "h-8 w-8 md:h-10 md:w-10"
                  )}
                </div>
                {/* Title */}
                <h3 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-yellow-700 transition-colors duration-300 text-center leading-tight">
                  {cards[0].title}
                </h3>
              </div>

              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/30 to-yellow-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
            </div>
          </Link>

          {/* Second ball - slightly lower */}
          <Link
            href={cards[1].href}
            target={cards[1].external ? "_blank" : "_self"}
            rel={cards[1].external ? "noopener noreferrer" : undefined}
            className="group relative transform -translate-y-2 md:translate-y-12"
          >
            <div
              className={`
              relative w-28 h-28 md:w-44 md:h-44 rounded-full bg-gradient-to-br ${cards[1].color} 
              border-3 shadow-2xl backdrop-blur-sm
              group-hover:scale-110 group-hover:shadow-3xl group-hover:-rotate-6
              transition-all duration-500 ease-out cursor-pointer
              border-red-300
            `}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200/50 to-rose-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>

              {/* Content inside ball */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* Icon */}
                <div className="mb-2">
                  {renderIcon(
                    cards[1].icon,
                    cards[1].iconColor,
                    "h-8 w-8 md:h-10 md:w-10"
                  )}
                </div>
                {/* Title */}
                <h3 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-pink-700 transition-colors duration-300 text-center leading-tight">
                  {cards[1].title}
                </h3>
              </div>

              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/30 to-rose-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
            </div>
          </Link>

          {/* Third ball - slightly lower */}
          <Link
            href={cards[2].href}
            target={cards[2].external ? "_blank" : "_self"}
            rel={cards[2].external ? "noopener noreferrer" : undefined}
            className="group relative transform -translate-y-2 md:translate-y-10"
          >
            <div
              className={`
              relative w-28 h-28 md:w-44 md:h-44 rounded-full bg-gradient-to-br ${cards[2].color} 
              border-3 shadow-2xl backdrop-blur-sm
              group-hover:scale-110 group-hover:shadow-3xl group-hover:rotate-6
              transition-all duration-500 ease-out cursor-pointer
              border-amber-300
            `}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/50 to-amber-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>

              {/* Content inside ball */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* Icon */}
                <div className="mb-2">
                  {renderIcon(
                    cards[2].icon,
                    cards[2].iconColor,
                    "h-8 w-8 md:h-10 md:w-10"
                  )}
                </div>
                {/* Title */}
                <h3 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300 text-center leading-tight">
                  {cards[2].title}
                </h3>
              </div>

              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/30 to-amber-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
            </div>
          </Link>

          {/* Right corner ball - positioned higher */}
          <Link
            href={cards[3].href}
            target={cards[3].external ? "_blank" : "_self"}
            rel={cards[3].external ? "noopener noreferrer" : undefined}
            className="group relative transform -translate-y-4 md:-translate-y-10"
          >
            <div
              className={`
              relative w-28 h-28 md:w-44 md:h-44 rounded-full bg-gradient-to-br ${cards[3].color} 
              border-3 shadow-2xl backdrop-blur-sm
              group-hover:scale-110 group-hover:shadow-3xl group-hover:-rotate-6
              transition-all duration-500 ease-out cursor-pointer
              border-green-400
            `}
            >
              {/* Glow effect - More intense green for WhatsApp */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-300/60 to-emerald-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>

              {/* Content inside ball */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* Icon */}
                <div className="mb-2">
                  {renderIcon(
                    cards[3].icon,
                    cards[3].iconColor,
                    "h-8 w-8 md:h-10 md:w-10"
                  )}
                </div>
                {/* Title */}
                <h3 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300 text-center leading-tight">
                  {cards[3].title}
                </h3>
              </div>

              {/* Pulse effect - More intense green */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/40 to-emerald-500/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
