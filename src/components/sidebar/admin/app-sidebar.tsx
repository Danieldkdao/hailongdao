import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarMain } from "./app-sidebar-main";
import { AppSidebarUser } from "./app-sidebar-user";
import { Suspense } from "react";
import { SidebarUserSkeleton } from "@/components/async-states";
import { AsyncErrorBoundary } from "@/components/async-error-boundary";
import { hasPermission } from "@/features/user/lib/permissions";

export const AppSidebar = async () => {
  const [
    canCreateMathProblems,
    canReadMathProblems,
    canManageUsers,
    canManagePasswords,
  ] = await Promise.all([
    hasPermission({ mathProblem: ["create"] }),
    hasPermission({ mathProblem: ["read"] }),
    hasPermission({ user: ["list"] }),
    hasPermission({ password: ["read"] }),
  ]);

  return (
    <Sidebar collapsible="icon">
      <AppSidebarMain
        canCreateMathProblems={canCreateMathProblems}
        canReadMathProblems={canReadMathProblems}
        canManageUsers={canManageUsers}
        canManagePasswords={canManagePasswords}
      />
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
