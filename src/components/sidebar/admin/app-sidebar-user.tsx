import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AppSidebarUserClient } from "./app-sidebar-user-client";

export const AppSidebarUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return <AppSidebarUserClient {...session.user} />;
};
