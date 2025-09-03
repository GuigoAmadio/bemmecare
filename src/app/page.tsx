import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  Globe,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-success/20 to-primary/20 rounded-full blur-xl animate-pulse"></div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 mb-8 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold text-sm">
                ✨ Mais de 10.000 produtos disponíveis
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-8 leading-tight">
              Bem-vindo à{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-heading">
                BemmeCare
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubra os melhores produtos com{" "}
              <span className="text-primary font-semibold">
                qualidade garantida
              </span>{" "}
              e entrega rápida.
              <br className="hidden md:block" />
              Sua experiência de compra online perfeita começa aqui.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  Explorar Produtos
                </Button>
              </Link>
              <Link href="/favoritos">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                >
                  <Heart className="mr-3 h-6 w-6" />
                  Meus Favoritos
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border border-primary/10 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    50k+
                  </div>
                  <div className="text-text-secondary font-medium">
                    Clientes Satisfeitos
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-success/10 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    99.8%
                  </div>
                  <div className="text-text-secondary font-medium">
                    Taxa de Satisfação
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-accent/10 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent/20 to-warning/20 rounded-2xl mx-auto mb-4">
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    24h
                  </div>
                  <div className="text-text-secondary font-medium">
                    Entrega Expressa
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <span className="text-primary font-semibold text-sm">
                💎 Experiência Premium
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Por que escolher a <span className="text-primary">BemmeCare</span>
              ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-white to-primary/5 border border-primary/10 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl mx-auto mb-6">
                  <Truck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  Entrega Rápida
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Entrega em todo o Brasil com{" "}
                  <span className="text-primary font-semibold">
                    frete grátis
                  </span>{" "}
                  para compras acima de R$ 100.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-success/5 border border-success/10 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success/20 to-primary/30 rounded-3xl mx-auto mb-6">
                  <Shield className="h-10 w-10 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  Compra Segura
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Seus dados protegidos com a{" "}
                  <span className="text-success font-semibold">
                    mais alta tecnologia
                  </span>{" "}
                  de segurança.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-accent/5 border border-accent/10 hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent/20 to-warning/30 rounded-3xl mx-auto mb-6">
                  <Award className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  Qualidade Garantida
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Produtos selecionados com{" "}
                  <span className="text-accent font-semibold">
                    garantia de qualidade
                  </span>{" "}
                  e satisfação.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </main>
  );
}
