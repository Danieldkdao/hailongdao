import { db } from "@/db/db";
import { MathProblemVoteTable, VoteType } from "@/db/schema";
import { revalidateMathProblemCache } from "@/features/math-problems/db/cache/math-problems";
import { and, eq } from "drizzle-orm";

export const insertProblemVote = async ({
  mathProblemId,
  userId,
  type,
}: {
  mathProblemId: string;
  userId: string;
  type: VoteType;
}) => {
  const whereQuery = and(
    eq(MathProblemVoteTable.userId, userId),
    eq(MathProblemVoteTable.mathProblemId, mathProblemId),
  );
  const existingVote = await db.query.MathProblemVoteTable.findFirst({
    where: whereQuery,
  });
  if (!existingVote) {
    await db
      .insert(MathProblemVoteTable)
      .values({ mathProblemId, userId, type });
  } else {
    await db.delete(MathProblemVoteTable).where(whereQuery);
    if (existingVote.type !== type) {
      await db
        .insert(MathProblemVoteTable)
        .values({ mathProblemId, userId, type });
    }
  }

  revalidateMathProblemCache({ id: mathProblemId, userId });
};
