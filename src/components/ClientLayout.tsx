"use client";

import DevModeIndicator from "@/components/ui/DevModeIndicator";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <DevModeIndicator />
    </>
  );
}
