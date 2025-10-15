import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import AuthGuard from "@/components/auth-guard";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthGuard>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <SidebarInset>
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </AuthGuard>
    </FirebaseClientProvider>
  );
}
