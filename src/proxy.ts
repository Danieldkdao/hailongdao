import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";
import { db } from "./db/db";
import { eq } from "drizzle-orm";
import { user } from "./db/schema";
import { hasPermissionForUser } from "./features/user/lib/permissions";

const authedRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export const proxy = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const session = await auth.api.getSession({ headers: request.headers });
  const existingUser = await db.query.user.findFirst({
    where: eq(user.id, session?.user.id ?? ""),
  });
  const canAccessAdminDashboard = existingUser
    ? (await hasPermissionForUser({
        permissions: { mathProblem: ["read"] },
        role: existingUser.role,
        userId: existingUser.id,
      })) ||
      (await hasPermissionForUser({
        permissions: { user: ["list"] },
        role: existingUser.role,
        userId: existingUser.id,
      }))
    : false;
  const canManageUsers = existingUser
    ? await hasPermissionForUser({
        permissions: { user: ["list"] },
        role: existingUser.role,
        userId: existingUser.id,
      })
    : false;

  if (existingUser && authedRoutes.includes(pathname)) {
    return NextResponse.redirect(
      new URL(canAccessAdminDashboard ? "/admin/create" : "/", request.url),
    );
  }

  if (pathname === "/admin/users" && !canManageUsers) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin") && !canAccessAdminDashboard) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.json|manifest.webmanifest|apple-icon.png|.*\\.[^/]+$).*)",
  ],
};
