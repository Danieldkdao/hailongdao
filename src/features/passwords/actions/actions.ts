"use server";

import { db } from "@/db/db";
import { PasswordTable, user } from "@/db/schema";
import { hasPermissionForUser } from "@/features/user/lib/permissions";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import {
  GENERAL_ERROR_MESSAGE,
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHED_MESSAGE,
} from "@/lib/auth/constants";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import {
  deletePasswordDb,
  insertPasswordDb,
  updatePasswordDb,
} from "../server/passwords";
import { passwordSchema, PasswordSchemaType } from "./schemas";
import { revalidateUserCache } from "@/features/user/db/cache/users";
import { cacheTag } from "next/cache";
import { getGlobalPasswordTag } from "../server/cache/passwords";

export const createPasswordAction = async (unsafeData: PasswordSchemaType) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user) {
    return {
      error: true,
      message: UNAUTHED_MESSAGE,
    };
  }
  if (
    !(await hasPermissionForUser({
      permissions: { password: ["create"] },
      role: user.role,
      userId,
    }))
  ) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = passwordSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  try {
    const createdPassword = await insertPasswordDb({
      ...data,
      createdByUserId: userId,
    });
    if (!createdPassword) {
      throw new Error("Failed to create password.");
    }

    return {
      error: false,
      message: "Password created successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const updatePasswordAction = async (
  passwordId: string,
  unsafeData: PasswordSchemaType,
) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user) {
    return {
      error: true,
      message: UNAUTHED_MESSAGE,
    };
  }
  if (
    !(await hasPermissionForUser({
      permissions: { password: ["update"] },
      role: user.role,
      userId,
    }))
  ) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = passwordSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  try {
    const updatedPassword = await updatePasswordDb(passwordId, data);
    if (!updatedPassword) {
      throw new Error("Failed to update password.");
    }

    return {
      error: false,
      message: "Password updated successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const updatePasswordEnabledAction = async (
  passwordId: string,
  enabled: boolean,
) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user) {
    return {
      error: true,
      message: UNAUTHED_MESSAGE,
    };
  }
  if (
    !(await hasPermissionForUser({
      permissions: { password: ["update"] },
      role: user.role,
      userId,
    }))
  ) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  try {
    const updatedPassword = await updatePasswordDb(passwordId, { enabled });
    if (!updatedPassword) {
      throw new Error("Failed to update password.");
    }

    return {
      error: false,
      message: `Password ${enabled ? "enabled" : "disabled"} successfully.`,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const deletePasswordAction = async (passwordId: string) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user) {
    return {
      error: true,
      message: UNAUTHED_MESSAGE,
    };
  }

  if (
    !(await hasPermissionForUser({
      permissions: { password: ["delete"] },
      role: user.role,
      userId,
    }))
  ) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const [existingPassword] = await db
    .select()
    .from(PasswordTable)
    .where(eq(PasswordTable.id, passwordId));
  if (!existingPassword) {
    return {
      error: true,
      message: NOT_FOUND_MESSAGE("Password"),
    };
  }

  try {
    const deletedPassword = await deletePasswordDb(passwordId);
    if (!deletedPassword) {
      throw new Error("Failed to delete password");
    }

    return {
      error: false,
      message: "Password deleted successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const getPasswordsAction = async () => {
  "use cache";
  cacheTag(getGlobalPasswordTag());

  const passwords = await db
    .select({
      ...getTableColumns(PasswordTable),
      user: getTableColumns(user),
    })
    .from(PasswordTable)
    .innerJoin(user, eq(user.id, PasswordTable.createdByUserId))
    .orderBy(desc(PasswordTable.createdAt));

  return passwords;
};

export const validatePasswordAction = async (password: string) => {
  const { userId } = await getCurrentUser();

  try {
    const [existingPassword] = await db
      .select()
      .from(PasswordTable)
      .where(
        and(
          eq(PasswordTable.enabled, true),
          eq(PasswordTable.password, password),
        ),
      );
    if (!existingPassword) {
      return {
        error: true,
        message: "Invalid password. Please try again.",
      };
    }

    if (userId) {
      await db
        .update(user)
        .set({
          lastValidatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      revalidateUserCache(userId);
    }

    return {
      error: false,
      message: "Password validated successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};
