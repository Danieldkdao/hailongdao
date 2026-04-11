import { db } from "@/db/db";
import { CommentVoteTable, VoteType } from "@/db/schema";
import { revalidateCommentCache } from "@/features/comments/db/cache/comments";
import { and, eq } from "drizzle-orm";

export const insertCommentVote = async ({
  mathProblemId,
  commentId,
  userId,
  type,
}: {
  mathProblemId: string;
  commentId: string;
  userId: string;
  type: VoteType;
}) => {
  const whereQuery = and(
    eq(CommentVoteTable.userId, userId),
    eq(CommentVoteTable.commentId, commentId),
  );
  const existingVote = await db.query.CommentVoteTable.findFirst({
    where: whereQuery,
  });
  if (!existingVote) {
    await db.insert(CommentVoteTable).values({ commentId, userId, type });
  } else {
    await db.delete(CommentVoteTable).where(whereQuery);
    if (existingVote.type !== type) {
      await db.insert(CommentVoteTable).values({ commentId, userId, type });
    }
  }

  revalidateCommentCache(mathProblemId);
};
