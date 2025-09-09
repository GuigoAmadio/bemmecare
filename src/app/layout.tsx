import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BemmeCare - Sua Loja Online de Confiança",
  description:
    "Descubra os melhores produtos com qualidade garantida e entrega rápida. BemmeCare - sua experiência de compra online perfeita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`antialiased bg-[#fff5e7] text-text-primary ${inter.variable} ${playfair.variable}`}
      >
        <NotificationProvider>
          <AuthProvider>
            <ThemeProvider>
              <CartProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </CartProvider>
            </ThemeProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
