"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Páginas que não devem ter header/footer
  const noLayoutPages = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/admin",
    "/dashboard",
  ];

  // Verifica se a página atual deve ter layout
  const shouldShowLayout = !noLayoutPages.some(
    (page) => pathname === page || pathname?.startsWith(page + "/")
  );

  if (!shouldShowLayout) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
