import "server-only";

import { getCurrentUser } from "@/lib/auth/auth-helpers";
import type { UserRole } from "@/db/schema";
import type { AppPermissions } from "./access-control";

export type { AppPermissions } from "./access-control";

type PermissionCheckArgs = {
  permissions: AppPermissions;
  role: UserRole;
  userId?: string;
};

export const hasPermissionForUser = async ({
  permissions,
  role,
  userId,
}: PermissionCheckArgs) => {
  const { auth } = await import("@/lib/auth/auth");
  const response = await auth.api.userHasPermission({
    body: {
      permissions,
      role,
      userId,
    },
  });

  return response.success;
};

export const hasPermission = async (permissions: AppPermissions) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user) return false;

  return hasPermissionForUser({
    permissions,
    role: user.role,
    userId,
  });
};
