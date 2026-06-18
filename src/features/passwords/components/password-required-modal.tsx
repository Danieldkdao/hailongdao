import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { Suspense } from "react";
import { PasswordRequiredModalClient } from "./password-required-modal-client";

export const PasswordRequiredModal = () => {
  return (
    <Suspense>
      <PasswordRequiredModalSuspense />
    </Suspense>
  );
};

const PasswordRequiredModalSuspense = async () => {
  const { user } = await getCurrentUser({ allData: true });
  const passwordExpiresAt = user?.lastValidatedAt
    ? new Date(user.lastValidatedAt.getTime() + 3 * 24 * 60 * 60 * 1000)
    : null;

  if (
    user?.role !== "admin" &&
    (!passwordExpiresAt || passwordExpiresAt <= new Date())
  ) {
    return <PasswordRequiredModalClient />;
  }

  return null;
};
