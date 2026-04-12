import { db } from "@/db/db";
import { MathProblemTable } from "@/db/schema";
import { revalidateMathProblemCache } from "./cache/math-problems";
import { inArray } from "drizzle-orm";

export const insertMathProblem = async (
  mathProblem: typeof MathProblemTable.$inferInsert,
) => {
  const [insertedMathProblem] = await db
    .insert(MathProblemTable)
    .values(mathProblem)
    .returning();

  revalidateMathProblemCache(insertedMathProblem);

  return insertedMathProblem;
};

export const updateMathProblems = async (
  ids: string[],
  mathProblem: Partial<typeof MathProblemTable.$inferSelect>,
) => {
  const [updatedMathProblem] = await db
    .update(MathProblemTable)
    .set(mathProblem)
    .where(inArray(MathProblemTable.id, ids))
    .returning();

  revalidateMathProblemCache(updatedMathProblem);

  return updatedMathProblem;
};

export const deleteMathProblems = async (ids: string[]) => {
  const [deletedMathProblem] = await db
    .delete(MathProblemTable)
    .where(inArray(MathProblemTable.id, ids))
    .returning();

  revalidateMathProblemCache(deletedMathProblem);
};
