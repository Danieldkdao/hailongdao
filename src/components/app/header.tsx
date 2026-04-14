import { AsyncErrorBoundary } from "@/components/async-error-boundary";
import { HeaderActionsSkeleton } from "@/components/async-states";
import { hasPermission } from "@/features/user/lib/permissions";
import { auth } from "@/lib/auth/auth";
import { LayoutDashboardIcon, LogInIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { HeaderUser } from "./header-user";

export const Header = () => {
  return (
    <header className="border-b shadow-sm">
      <div className="md:max-w-5xl py-6 px-4 mx-auto w-full flex justify-between items-center gap-2">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-medium">
            Home
          </Link>
          <Link href="/about" className="text-base font-medium">
            About
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Suspense fallback={<HeaderActionsSkeleton />}>
            <AsyncErrorBoundary
              variant="inline"
              title="Header unavailable"
              description="We couldn't load your account controls right now."
            >
              <HeaderSuspense />
            </AsyncErrorBoundary>
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

const HeaderSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return (
      <Button variant="ghost" asChild>
        <Link href="/sign-in">
          <LogInIcon />
          Sign in
        </Link>
      </Button>
    );

  const canAccessDashboard =
    (await hasPermission({ mathProblem: ["read"] })) ||
    (await hasPermission({ user: ["list"] }));

  if (canAccessDashboard) {
    return (
      <Button asChild>
        <Link href="/admin/create">
          <LayoutDashboardIcon />
          Dashboard
        </Link>
      </Button>
    );
  } else {
    return <HeaderUser name={session.user.name} image={session.user.image} />;
  }
};
