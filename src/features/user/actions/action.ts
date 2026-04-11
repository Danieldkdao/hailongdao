"use server";

import { headers } from "next/headers";
import { cacheTag } from "next/cache";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { db } from "@/db/db";
import { CommentTable, session, user, UserRole } from "@/db/schema";
import {
  ERROR_MESSAGE,
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { ActionOutput } from "@/lib/types";
import { getUserGlobalTag, revalidateUserCache } from "../db/cache/users";

const USER_BAN_DURATIONS = {
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
  permanent: undefined,
} as const;

export type UserBanDuration = keyof typeof USER_BAN_DURATIONS;

const isUserRole = (value: string): value is UserRole => {
  return value === "admin" || value === "user";
};

const getActionErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;
  return ERROR_MESSAGE;
};

const formatRowCount = (count: number, singular: string, plural: string) => {
  return `${count} ${count === 1 ? singular : plural}`;
};

const revalidateUsers = (userIds: string[]) => {
  const uniqueUserIds = [...new Set(userIds)];

  uniqueUserIds.forEach((userId) => {
    revalidateUserCache(userId);
  });
};

const requireAdminUser = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (!userId || !user || user.role !== "admin") {
    return {
      error: true as const,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  return {
    error: false as const,
    userId,
  };
};

export const getUsers = async () => {
  "use cache";
  cacheTag(getUserGlobalTag());

  const sessionCount = sql<number>`(
    SELECT COUNT(*)
    FROM ${session} sessions
    JOIN ${user} ut ON ut.id = sessions.user_id
    WHERE sessions.user_id = "user"."id"
  )`;

  const commentCount = sql<number>`(
    SELECT COUNT(*)
    FROM ${CommentTable} comments
    JOIN ${user} ut ON ut.id = comments.user_id
    WHERE comments.user_id = "user"."id"
  )`;

  return db
    .select({
      ...getTableColumns(user),
      sessionCount,
      commentCount,
    })
    .from(user)
    .where(eq(user.role, "user"))
    .orderBy(desc(user.createdAt), desc(user.id));
};

export const updateUsersRole = async (userIds: string[], role: string) => {
  const adminUser = await requireAdminUser();
  if (adminUser.error) return adminUser;

  if (!isUserRole(role) || userIds.length === 0) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  if (role === "user" && userIds.includes(adminUser.userId)) {
    return {
      error: true,
      message: "You cannot remove your own admin access.",
    };
  }

  try {
    const requestHeaders = await headers();

    await Promise.all(
      userIds.map((userId) =>
        auth.api.setRole({
          headers: requestHeaders,
          body: {
            userId,
            role,
          },
        }),
      ),
    );

    revalidateUsers(userIds);

    return {
      error: false,
      message: `${formatRowCount(userIds.length, "user", "users")} updated to ${role}.`,
    };
  } catch (error) {
    return {
      error: true,
      message: getActionErrorMessage(error),
    };
  }
};

export const updateUsersEmailVerification = async (
  userIds: string[],
  emailVerified: boolean,
) => {
  const adminUser = await requireAdminUser();
  if (adminUser.error) return adminUser;

  if (userIds.length === 0) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  try {
    const requestHeaders = await headers();

    await Promise.all(
      userIds.map((userId) =>
        auth.api.adminUpdateUser({
          headers: requestHeaders,
          body: {
            userId,
            data: {
              emailVerified,
            },
          },
        }),
      ),
    );

    revalidateUsers(userIds);

    return {
      error: false,
      message: `${formatRowCount(userIds.length, "user", "users")} marked as ${
        emailVerified ? "verified" : "unverified"
      }.`,
    };
  } catch (error) {
    return {
      error: true,
      message: getActionErrorMessage(error),
    };
  }
};

export const banUsers = async (
  userIds: string[],
  duration: UserBanDuration,
  banReason = "Suspended by an administrator.",
) => {
  const adminUser = await requireAdminUser();
  if (adminUser.error) return adminUser;

  if (userIds.length === 0 || !(duration in USER_BAN_DURATIONS)) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  if (userIds.includes(adminUser.userId)) {
    return {
      error: true,
      message: "You cannot ban your own account.",
    };
  }

  try {
    const requestHeaders = await headers();

    await Promise.all(
      userIds.map((userId) =>
        auth.api.banUser({
          headers: requestHeaders,
          body: {
            userId,
            banReason,
            banExpiresIn: USER_BAN_DURATIONS[duration],
          },
        }),
      ),
    );

    revalidateUsers(userIds);

    return {
      error: false,
      message: `${formatRowCount(userIds.length, "user", "users")} banned successfully.`,
    };
  } catch (error) {
    return {
      error: true,
      message: getActionErrorMessage(error),
    };
  }
};

export const unbanUsers = async (userIds: string[]) => {
  const adminUser = await requireAdminUser();
  if (adminUser.error) return adminUser;

  if (userIds.length === 0) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  try {
    const requestHeaders = await headers();

    await Promise.all(
      userIds.map((userId) =>
        auth.api.unbanUser({
          headers: requestHeaders,
          body: {
            userId,
          },
        }),
      ),
    );

    revalidateUsers(userIds);

    return {
      error: false,
      message: `${formatRowCount(userIds.length, "user", "users")} unbanned successfully.`,
    };
  } catch (error) {
    return {
      error: true,
      message: getActionErrorMessage(error),
    };
  }
};

export const revokeUsersSessions = async (userIds: string[]) => {
  const adminUser = await requireAdminUser();
  if (adminUser.error) return adminUser;

  if (userIds.length === 0) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  if (userIds.includes(adminUser.userId)) {
    return {
      error: true,
      message: "You cannot revoke your own active sessions from this table.",
    };
  }

  try {
    const requestHeaders = await headers();

    await Promise.all(
      userIds.map((userId) =>
        auth.api.revokeUserSessions({
          headers: requestHeaders,
          body: {
            userId,
          },
        }),
      ),
    );

    revalidateUsers(userIds);

    return {
      error: false,
      message: `Revoked sessions for ${formatRowCount(userIds.length, "user", "users")}.`,
    };
  } catch (error) {
    return {
      error: true,
      message: getActionErrorMessage(error),
    };
  }
};

export const deleteUsers = async (userIds: string[]) => {
  const adminUser = await requireAdminUser();
  if (adminUser.error) return adminUser;

  if (userIds.length === 0) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  if (userIds.includes(adminUser.userId)) {
    return {
      error: true,
      message: "You cannot delete your own account.",
    };
  }

  try {
    const requestHeaders = await headers();

    await Promise.all(
      userIds.map((userId) =>
        auth.api.removeUser({
          headers: requestHeaders,
          body: {
            userId,
          },
        }),
      ),
    );

    revalidateUsers(userIds);

    return {
      error: false,
      message: `${formatRowCount(userIds.length, "user", "users")} deleted successfully.`,
    };
  } catch (error) {
    return {
      error: true,
      message: getActionErrorMessage(error),
    };
  }
};

export type GetUsersType = ActionOutput<typeof getUsers>;
