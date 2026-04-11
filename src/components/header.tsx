import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Button } from "./ui/button";
import { LayoutDashboardIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { Suspense } from "react";
import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  return (
    <header className="border-b shadow-sm">
      <div className="md:max-w-5xl py-6 px-4 mx-auto w-full flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold">HailongDaoMath</h1>
        <div className="flex items-center gap-2">
          <Suspense>
            <HeaderSuspense />
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

  if (session.user.role === "admin") {
    return (
      <Button asChild>
        <Link href="/admin">
          <LayoutDashboardIcon />
          Dashboard
        </Link>
      </Button>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <UserAvatar name={session.user.name} image={session.user.image} />
        <span className="font-medium">{session.user.name}</span>
      </div>
    );
  }
};
