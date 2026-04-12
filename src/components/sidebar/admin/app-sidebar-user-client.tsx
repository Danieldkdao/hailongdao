"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SidebarFooter } from "@/components/ui/sidebar";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AppSidebarUserClient = ({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) => {
  const router = useRouter();

  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 text-left outline-none transition-colors hover:bg-sidebar-accent",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:border-none",
            )}
          >
            <UserAvatar
              name={name}
              image={image}
              className="size-9 shrink-0"
              textClassName="bg-primary text-primary-foreground"
            />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {name}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {email}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          alignOffset={100}
          className="w-64"
        >
          <div className="flex items-center gap-3 px-2 py-1.5">
            <UserAvatar
              name={name}
              image={image}
              className="size-10 shrink-0"
              textClassName="bg-primary text-primary-foreground"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("User signed out successfully!");
                    router.push("/");
                  },
                  onError: (error) => {
                    toast.error(error.error.message || "");
                  },
                },
              });
            }}
          >
            <LogOutIcon />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
};
