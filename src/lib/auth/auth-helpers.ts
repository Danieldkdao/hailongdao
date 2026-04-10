import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { cacheTag } from "next/cache";
import { getUserIdTag } from "@/features/user/db/cache/users";

export const getCurrentUser = async ({ allData = false } = {}) => {
  const session = await auth.api.getSession({ headers: await headers() });

  return {
    userId: session?.user.id ?? null,
    user: allData && session ? await getUser(session.user.id) : undefined,
  };
};

const getUser = async (userId: string) => {
  "use cache";
  cacheTag(getUserIdTag(userId));

  return db.query.user.findFirst({
    where: eq(user.id, userId),
  });
};
