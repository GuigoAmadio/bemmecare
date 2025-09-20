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
  const naturalIngredients = [
    {
      name: "Esqualano de Oliva",
      description:
        "Hidrata profundamente a pele sem oleosidade, com propriedades antioxidantes que combatem o envelhecimento precoce e melhoram a elasticidade natural.",
      image: "/frutas/olivas.png",
      titleColor: "text-green-700", // Verde oliva
      benefits: [
        "Hidratação intensa",
        "Antioxidante natural",
        "Mais elasticidade",
      ],
    },
    {
      name: "Óleo de Semente de Uva",
      description:
        "Rico em ácidos graxos essenciais, regenera a pele, melhora a cicatrização e combate sinais de envelhecimento com textura leve e absorção rápida.",
      image: "/frutas/uva.png",
      titleColor: "text-purple-600", // Roxo uva
      benefits: ["Regenerativo", "Anti-idade", "Textura leve"],
    },
    {
      name: "Manteiga de Manga Rosa",
      description:
        "Emoliente natural que proporciona hidratação profunda, rica em vitaminas e antioxidantes, ajuda a regenerar a pele e reduzir cicatrizes.",
      image: "/frutas/manga.png",
      titleColor: "text-orange-500", // Laranja manga
      benefits: ["Hidratação profunda", "Rico em vitaminas", "Regenerador"],
    },
    {
      name: "Óleo Essencial de Hortelã",
      description:
        "Refrescante natural com propriedades analgésicas e anti-inflamatórias, alivia dores musculares, melhora circulação e trata irritações cutâneas.",
      image: "/frutas/hortela.png",
      titleColor: "text-green-500", // Verde hortelã
      benefits: ["Refrescante", "Anti-inflamatório", "Melhora circulação"],
    },
    {
      name: "Óleo de Coco",
      description:
        "Hidratante natural com propriedades antioxidantes que mantém a pele macia, elástica e protegida contra ressecamento, prevenindo o envelhecimento precoce.",
      image: "/frutas/coco.png",
      titleColor: "text-amber-700", // Marrom claro coco
      benefits: [
        "Hidratante natural",
        "Antioxidante",
        "Previne envelhecimento",
      ],
    },
    {
      name: "Manteiga de Maracujá",
      description:
        "Rica em ácidos graxos essenciais e vitaminas, proporciona hidratação profunda e nutrição com propriedades calmantes que aliviam irritações e vermelhidão.",
      image: "/frutas/maracuja.png",
      titleColor: "text-yellow-500", // Amarelo vibrante maracujá
      benefits: [
        "Hidratação profunda",
        "Rica em vitaminas",
        "Propriedades calmantes",
      ],
    },
    {
      name: "Óleo de Amêndoas Doces",
      description:
        "Hidratante natural que suaviza a pele mantendo-a macia e flexível. Rico em vitamina E, combate sinais de envelhecimento como rugas e linhas finas.",
      image: "/frutas/amendoas.png",
      titleColor: "text-amber-600", // Bege claro amêndoa
      benefits: ["Suaviza a pele", "Rico em vitamina E", "Anti-rugas"],
    },
    {
      name: "Óleo de Castanha-do-Pará",
      description:
        "Rico em selênio e ácidos graxos com propriedades antioxidantes e hidratantes, protege a pele contra danos dos radicais livres e mantém hidratação natural.",
      image: "/frutas/castanha-do-para.png",
      titleColor: "text-amber-800", // Marrom claro castanha
      benefits: ["Rico em selênio", "Antioxidante", "Proteção natural"],
    },
  ];

  return (
    <section
      className={`py-24 bg-gradient-to-b from-background to-background-secondary relative overflow-hidden ${className}`}
    >
      {/* Folhas decorativas */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-folha1 bg-no-repeat bg-right-top bg-contain opacity-40"></div>
      <div className="absolute top-0 left-0 w-80 h-80 bg-folha2 bg-no-repeat bg-left-top bg-contain opacity-40"></div>

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold text-sm">
              🌿 Ingredientes Naturais Selecionados
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 font-heading">
            O poder da{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              natureza
            </span>{" "}
            em cada produto
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Descubra os benefícios únicos dos nossos ingredientes naturais,
            cuidadosamente selecionados para proporcionar o melhor cuidado para
            sua pele.
          </p>
        </div>

        {/* Ingredientes Naturais - Layout Alternado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mx-auto max-w-7xl">
          {naturalIngredients.map((ingredient, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12 lg:gap-16`}
            >
              {/* Texto */}
              <div className="flex-1 space-y-6">
                <div
                  className={`flex items-start gap-4 ${
                    index % 2 !== 0
                      ? "flex-row-reverse justify-end"
                      : "justify-start"
                  }`}
                >
                  <div>
                    <div
                      className={`flex items-center gap-4 ${
                        index % 2 === 0 ? "justify-start" : "justify-end"
                      }`}
                    >
                      <h3
                        className={`text-2xl font-bold mb-4 font-heading ${ingredient.titleColor}`}
                      >
                        {ingredient.name}
                      </h3>
                    </div>
                    <p
                      className={`text-sm text-text-secondary leading-relaxed ${
                        index % 2 === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {ingredient.description}
                    </p>
                    {/* Benefícios */}
                    <div
                      className={`flex flex-wrap gap-2 mt-2 ${
                        index % 2 === 0 ? "justify-start" : "justify-end"
                      }`}
                    >
                      {ingredient.benefits.map((benefit, benefitIndex) => (
                        <div
                          key={benefitIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-text-primary font-medium text-sm">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Imagem */}
                  <div className="flex-1 relative">
                    <div className="w-52 mx-auto">
                      {/* Efeito de brilho atrás */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 rounded-3xl blur-2xl scale-110 animate-pulse"></div>

                      {/* Container da imagem */}
                      <div className="relative p-3 bg-gradient-to-br from-background to-background-secondary rounded-3xl shadow-2xl border border-black/10">
                        <div className="relative h-40">
                          <Image
                            src={ingredient.image}
                            alt={ingredient.name}
                            fill
                            className="object-contain transition-transform duration-500 hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
