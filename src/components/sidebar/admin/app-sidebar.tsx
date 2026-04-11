import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarMain } from "./app-sidebar-main";
import { AppSidebarUser } from "./app-sidebar-user";
import { Suspense } from "react";
import { SidebarUserSkeleton } from "@/components/async-states";
import { AsyncErrorBoundary } from "@/components/async-error-boundary";

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarMain />
      <Suspense fallback={<SidebarUserSkeleton />}>
        <AsyncErrorBoundary
          variant="sidebar"
          title="Profile unavailable"
          description="Your admin profile controls could not be loaded."
        >
          <AppSidebarUser />
        </AsyncErrorBoundary>
      </Suspense>
      <SidebarRail />
    </Sidebar>
  );
};
