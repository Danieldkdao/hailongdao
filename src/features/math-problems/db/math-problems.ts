import { db } from "@/db/db";
import { MathProblemTable } from "@/db/schema";
import { revalidateMathProblemCache } from "./cache/math-problems";
import { eq } from "drizzle-orm";

export const insertMathProblem = async (
  mathProblem: typeof MathProblemTable.$inferInsert,
) => {
  const [insertedMathProblem] = await db
    .insert(MathProblemTable)
    .values(mathProblem)
    .returning();

  revalidateMathProblemCache(insertedMathProblem);
};

export const updateMathProblem = async (
  id: string,
  mathProblem: Partial<typeof MathProblemTable.$inferSelect>,
) => {
  const [insertedMathProblem] = await db
    .update(MathProblemTable)
    .set(mathProblem)
    .where(eq(MathProblemTable.id, id))
    .returning();

  revalidateMathProblemCache(insertedMathProblem);
};
