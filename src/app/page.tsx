import HeroSection from "@/components/home/HeroSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import MerchantSection from "@/components/home/MerchantSection";
import NavigationCards from "@/components/home/NavigationCards";
import CTASection from "@/components/home/CTASection";

// Mock data - em produção, isso viria de uma API
const mockProducts = [
  {
    id: "1",
    name: "Óleo Essencial de Lavanda",
    description:
      "Óleo essencial puro de lavanda, perfeito para relaxamento e aromaterapia",
    price: 45.9,
    oldPrice: 59.9,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "1",
      name: "Óleos Essenciais",
      slug: "oleos-essenciais",
      description: "Óleos essenciais puros",
      image: "",
      level: 1,
      path: "oleos-essenciais",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 1,
      productCount: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    isFeatured: true,
    features: ["100% Natural", "Aromaterapia", "Relaxamento"],
    specifications: {
      Volume: "10ml",
      Origem: "França",
      "Tipo de pele": "Todas",
      Tipo: "Essencial",
      Peso: "10g",
      Uso: "Aromaterapia",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Creme Hidratante Natural",
    description:
      "Creme hidratante com ingredientes naturais para todos os tipos de pele",
    price: 32.5,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "2",
      name: "Cuidados com a Pele",
      slug: "cuidados-pele",
      description: "Produtos para cuidados com a pele",
      image: "",
      level: 1,
      path: "cuidados-pele",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 2,
      productCount: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.6,
    reviewCount: 89,
    stock: 8,
    isFeatured: false,
    features: [
      "Hidratação profunda",
      "Ingredientes naturais",
      "Para todos os tipos de pele",
    ],
    specifications: {
      Volume: "50ml",
      "Tipo de pele": "Todas",
      Origem: "Brasil",
      Tipo: "Hidratante",
      Peso: "50g",
      Uso: "Facial",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Shampoo Orgânico",
    description: "Shampoo orgânico para cabelos saudáveis e brilhantes",
    price: 28.9,
    oldPrice: 35.9,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "3",
      name: "Cabelos",
      slug: "cabelos",
      description: "Produtos para cabelos",
      image: "",
      level: 1,
      path: "cabelos",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 3,
      productCount: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.7,
    reviewCount: 156,
    stock: 12,
    isFeatured: true,
    features: ["Orgânico", "Sem sulfatos", "Para todos os tipos de cabelo"],
    specifications: {
      Volume: "300ml",
      Tipo: "Orgânico",
      Origem: "Brasil",
      "Tipo de pele": "Todas",
      Peso: "300g",
      Uso: "Capilar",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Sabonete Artesanal",
    description:
      "Sabonete artesanal com ingredientes naturais e essências suaves",
    price: 18.5,
    image:
      "https://images.unsplash.com/photo-1556228453-5b3bbaa7b5c3?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556228453-5b3bbaa7b5c3?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "4",
      name: "Higiene",
      slug: "higiene",
      description: "Produtos de higiene",
      image: "",
      level: 1,
      path: "higiene",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 4,
      productCount: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.9,
    reviewCount: 203,
    stock: 25,
    isFeatured: false,
    features: ["Artesanal", "Ingredientes naturais", "Essências suaves"],
    specifications: {
      Peso: "100g",
      Tipo: "Artesanal",
      Origem: "Brasil",
      "Tipo de pele": "Todas",
      Volume: "100g",
      Uso: "Corporal",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Óleo de Coco Virgem",
    description:
      "Óleo de coco virgem extraído a frio, ideal para cuidados naturais",
    price: 42.0,
    image: "/api/placeholder/300/300",
    images: ["/api/placeholder/300/300"],
    category: {
      id: "5",
      name: "Óleos Naturais",
      slug: "oleos-naturais",
      description: "Óleos naturais",
      image: "",
      level: 1,
      path: "oleos-naturais",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 5,
      productCount: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.8,
    reviewCount: 167,
    stock: 6,
    isFeatured: true,
    features: ["Virgem", "Extraído a frio", "Multiuso"],
    specifications: {
      Volume: "200ml",
      Origem: "Brasil",
      "Tipo de pele": "Todas",
      Tipo: "Virgem",
      Peso: "200g",
      Uso: "Multiuso",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Máscara Facial",
    description:
      "Máscara facial nutritiva com ingredientes naturais para revitalizar a pele",
    price: 38.9,
    oldPrice: 48.9,
    image: "/api/placeholder/300/300",
    images: ["/api/placeholder/300/300"],
    category: {
      id: "2",
      name: "Cuidados com a Pele",
      slug: "cuidados-pele",
      description: "Produtos para cuidados com a pele",
      image: "",
      level: 1,
      path: "cuidados-pele",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 2,
      productCount: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.5,
    reviewCount: 94,
    stock: 10,
    isFeatured: false,
    features: ["Nutritiva", "Ingredientes naturais", "Revitalizante"],
    specifications: {
      Volume: "75ml",
      Uso: "Facial",
      Origem: "Brasil",
      "Tipo de pele": "Todas",
      Tipo: "Nutritiva",
      Peso: "75g",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden relative bg-[#fff5e7]">
      {/* Folhas decorativas globais */}
      {/* Importando folha2 para uso como elemento decorativo */}

      {/* Hero Section */}
      <HeroSection />

      {/* Produtos Mais Vendidos */}
      <ProductCarousel
        title="Produtos Mais Vendidos"
        subtitle="Os favoritos dos nossos clientes, selecionados especialmente para você"
        products={mockProducts.slice(0, 6)}
        showViewAll={true}
        viewAllHref="/catalogo"
      />

      {/* Seção sobre Ingredientes Naturais */}
      <MerchantSection />

      {/* Segundo Carrossel de Produtos */}
      <ProductCarousel
        title="Novidades da Estação"
        subtitle="Descubra os lançamentos mais recentes com ingredientes naturais"
        products={mockProducts.slice(2, 6)}
        showViewAll={true}
        viewAllHref="/catalogo?filter=novidades"
        className="bg-background-secondary"
      />

      {/* Cards de Navegação */}
      <NavigationCards />

      {/* Seção CTA */}
      <CTASection />
    </main>
  );
}
