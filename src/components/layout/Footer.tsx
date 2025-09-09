import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background-secondary to-background border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand + Newsletter */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BemmeCare
                </span>
              </Link>
              <p className="text-text-secondary mb-6 leading-relaxed text-sm">
                Sua experiência de compra online perfeita. Produtos de qualidade
                com entrega rápida e segura em todo o Brasil.
              </p>

              {/* Newsletter integrada */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-text-primary mb-3">
                  📧 Receba nossas ofertas
                </h4>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Inscrever-se
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-primary"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-primary"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-9 h-9 bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-primary"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-text-primary mb-6">
                Links Rápidos
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/catalogo"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ofertas"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Ofertas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favoritos"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/carrinho"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Carrinho
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-bold text-text-primary mb-6">Atendimento</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/ajuda"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rastreamento"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Rastrear Pedido
                  </Link>
                </li>
                <li>
                  <Link
                    href="/devolucoes"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Trocas e Devoluções
                  </Link>
                </li>
                <li>
                  <Link
                    href="/garantia"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Garantia
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-text-primary mb-6">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-text-secondary">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>contato@bemmecare.com.br</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>(11) 1234-5678</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-text-secondary text-sm">
              © 2024 BemmeCare. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-1 text-text-secondary text-sm">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-error fill-current" />
              <span>no Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
