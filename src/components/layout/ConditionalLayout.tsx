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
    return <main className="bg-background text-text-primary">{children}</main>;
  }

  return (
    <>
      <Header />
      {pathname === "/" && (
        <img
          src="/fundo/folha2.svg"
          alt=""
          className="absolute top-0 left-0 select-none flex justify-start w-48 z-10"
          draggable={false}
          aria-hidden="true"
        />
      )}
      <main className="bg-[#fff5e7] text-text-primary">{children}</main>
      <Footer />
    </>
  );
}
