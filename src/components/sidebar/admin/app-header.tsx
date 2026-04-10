"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-sm font-semibold text-foreground">MathApp</span>
      </div>
      <ThemeToggle />
    </header>
  );
};
