import { db } from "@/db/db";
import { MathProblemTable } from "@/db/schema";
import { revalidateMathProblemCache } from "./cache/math-problems";

export const insertMathProblem = async (
  mathProblem: typeof MathProblemTable.$inferInsert,
) => {
  const [insertedMathProblem] = await db
    .insert(MathProblemTable)
    .values(mathProblem)
    .returning();

  revalidateMathProblemCache(insertedMathProblem);
};
