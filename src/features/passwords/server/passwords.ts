import { db } from "@/db/db";
import { PasswordTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePasswordCache } from "./cache/passwords";

export const insertPasswordDb = async (
  passwordData: typeof PasswordTable.$inferInsert,
) => {
  const [insertedPassword] = await db
    .insert(PasswordTable)
    .values(passwordData)
    .returning();

  revalidatePasswordCache();

  return insertedPassword;
};

export const updatePasswordDb = async (
  passwordId: string,
  passwordData: Partial<typeof PasswordTable.$inferSelect>,
) => {
  const [updatedPassword] = await db
    .update(PasswordTable)
    .set(passwordData)
    .where(eq(PasswordTable.id, passwordId))
    .returning();

  revalidatePasswordCache();

  return updatedPassword;
};

export const deletePasswordDb = async (passwordId: string) => {
  const [deletedPassword] = await db
    .delete(PasswordTable)
    .where(eq(PasswordTable.id, passwordId))
    .returning();

  revalidatePasswordCache();

  return deletedPassword;
};
