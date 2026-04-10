import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarMain } from "./app-sidebar-main";
import { AppSidebarUser } from "./app-sidebar-user";
import { Suspense } from "react";

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarMain />
      <Suspense>
        <AppSidebarUser />
      </Suspense>
      <SidebarRail />
    </Sidebar>
  );
};
