import { AppHeader } from "@/components/sidebar/admin/app-header";
import { AppSidebar } from "@/components/sidebar/admin/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
