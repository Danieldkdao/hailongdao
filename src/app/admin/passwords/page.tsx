import { AsyncErrorBoundary } from "@/components/async-error-boundary";
import { AdminTableSkeleton } from "@/components/async-states";
import { Button } from "@/components/ui/button";
import { getPasswordsAction } from "@/features/passwords/actions/actions";
import { PasswordDialog } from "@/features/passwords/components/password-dialog";
import { PasswordListTable } from "@/features/passwords/components/password-list-table";
import { hasPermission } from "@/features/user/lib/permissions";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const PasswordsPage = () => {
  return (
    <div className="space-y-4 px-6 py-10">
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-3xl font-bold">Passwords</h1>
        <PasswordDialog>
          <Button>
            <PlusIcon />
            Create
          </Button>
        </PasswordDialog>
      </div>

      <Suspense fallback={<AdminTableSkeleton columns={7} />}>
        <AsyncErrorBoundary
          title="Couldn't load users"
          description="User management data is unavailable right now. Please retry in a moment."
        >
          <PasswordsSuspense />
        </AsyncErrorBoundary>
      </Suspense>
    </div>
  );
};

const PasswordsSuspense = async () => {
  const [{ userId }, canReadPasswords] = await Promise.all([
    getCurrentUser(),
    hasPermission({ password: ["read"] }),
  ]);
  if (!userId || !canReadPasswords) {
    redirect("/");
  }

  const passwords = await getPasswordsAction();

  return <PasswordListTable passwords={passwords} />;
};

export default PasswordsPage;
