import { AppHeader } from "@/components/sidebar/admin/app-header";
import { AppSidebar } from "@/components/sidebar/admin/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex-1 min-w-0 overflow-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
