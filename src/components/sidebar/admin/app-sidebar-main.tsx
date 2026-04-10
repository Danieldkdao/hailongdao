"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BookOpenIcon, PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/admin/create",
    label: "Create",
    icon: PlusIcon,
  },
  {
    href: "/admin/math-problems",
    label: "Math Problems",
    icon: BookOpenIcon,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: UsersIcon,
  },
] as const;

export const AppSidebarMain = () => {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
            <p className="truncate text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              MathApp
            </p>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
};
