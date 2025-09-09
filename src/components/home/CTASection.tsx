"use client";

import { useState } from "react";
import { Mail, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface CTASectionProps {
  className?: string;
}

export default function CTASection({ className = "" }: CTASectionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  const benefits = [
    "Ofertas exclusivas e descontos especiais",
    "Primeiro acesso a novos produtos",
    "Dicas de cuidados naturais",
    "Conteúdo exclusivo sobre bem-estar",
  ];

  return (
    <section
      className={`py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background ${className}`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 mb-6 shadow-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold text-sm">
                ✨ Oferta Especial
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 font-heading">
              Receba{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                10% de desconto
              </span>{" "}
              na sua primeira compra
            </h2>

            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Inscreva-se em nossa newsletter e ganhe desconto exclusivo, além
              de receber dicas valiosas sobre cuidados naturais e bem-estar.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-text-secondary">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full px-6 py-4 border-2 border-border rounded-xl bg-white/80 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  size="lg"
                  variant="primary"
                  className="bg-gradient-to-r from-primary to-primary-light hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-xl group whitespace-nowrap"
                >
                  <Mail className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Quero Desconto
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-success/20 shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Inscrição realizada!
                </h3>
                <p className="text-text-secondary">
                  Verifique seu e-mail para confirmar a inscrição e receber seu
                  cupom de desconto.
                </p>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl mx-auto mb-3">
                <span className="text-xl">🔒</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-1">
                100% Seguro
              </h4>
              <p className="text-sm text-text-secondary">
                Seus dados estão protegidos
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-success/20 to-primary/20 rounded-xl mx-auto mb-3">
                <span className="text-xl">📧</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-1">Sem Spam</h4>
              <p className="text-sm text-text-secondary">
                Apenas conteúdo relevante
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-accent/20 to-warning/20 rounded-xl mx-auto mb-3">
                <span className="text-xl">❌</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-1">
                Cancele Quando Quiser
              </h4>
              <p className="text-sm text-text-secondary">Sem compromisso</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
