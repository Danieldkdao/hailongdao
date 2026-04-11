"use server";

import { CommentTable, VoteType, voteTypes } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import {
  INVALID_DATA_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHED_MESSAGE,
} from "@/lib/auth/constants";
import z from "zod";
import { insertCommentVote } from "../db/comment-votes";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

export const voteOnComment = async ({
  commentId,
  unsafeType,
}: {
  commentId: string;
  unsafeType: VoteType;
}) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: UNAUTHED_MESSAGE,
    };
  }

  const { success, data } = z.enum(voteTypes).safeParse(unsafeType);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  const existingComment = await db.query.CommentTable.findFirst({
    where: eq(CommentTable.id, commentId),
  });

  if (!existingComment) {
    return {
      error: true,
      message: NOT_FOUND_MESSAGE("Comment"),
    };
  }

  await insertCommentVote({
    mathProblemId: existingComment.mathProblemId,
    commentId: existingComment.id,
    userId,
    type: data,
  });

  return {
    error: false,
    message: "Comment vote updated successfully!",
  };
};
