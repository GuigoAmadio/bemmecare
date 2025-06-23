import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { isAuthenticationEnabled, getCurrentUser } from "@/lib/auth-config";
import Sidebar from "@/components/ui/Sidebar";
import DevModeIndicator from "@/components/ui/DevModeIndicator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;

  // 🚀 MODO DESENVOLVIMENTO: Bypass de autenticação
  if (!isAuthenticationEnabled()) {
    console.log(
      "🔓 [DEV MODE] BemMeCare - Autenticação desabilitada - Acesso livre ao dashboard"
    );
    user = getCurrentUser();
  } else {
    // Verificar autenticação normal em produção
    user = await getAuthUser();

    if (!user) {
      redirect("/login");
    }
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      <DevModeIndicator />
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-50">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
