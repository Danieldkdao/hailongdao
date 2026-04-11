import { db } from "@/db/db";
import { CommentTable } from "@/db/schema";
import { revalidateCommentCache } from "./cache/comments";

export const insertComment = async (data: typeof CommentTable.$inferInsert) => {
  const [insertedComment] = await db
    .insert(CommentTable)
    .values(data)
    .returning();

  revalidateCommentCache(insertedComment.mathProblemId);
};
