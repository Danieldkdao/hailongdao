"use server";

import { cacheTag } from "next/cache";
import { getMathProblemCommentTag } from "../db/cache/comments";
import { db } from "@/db/db";
import { CommentTable, CommentVoteTable, user, VoteType } from "@/db/schema";
import { asc, count, desc, eq, getTableColumns, sql, SQL } from "drizzle-orm";
import { PAGE_SIZE } from "@/lib/constants";
import { SORT_BY } from "../lib/params";
import { ActionOutput } from "@/lib/types";
import { createCommentSchema, CreateCommentSchemaType } from "./schemas";
import { INVALID_DATA_MESSAGE } from "@/lib/auth/constants";
import { insertComment } from "../db/comments";
import { getCurrentUser } from "@/lib/auth/auth-helpers";

export const getComments = async ({
  userId,
  mathProblemId,
  page,
  sortBy,
}: {
  userId: string | null;
  mathProblemId: string;
  page: number;
  sortBy: (typeof SORT_BY)[number];
}): Promise<{
  comments: (typeof CommentTable.$inferSelect & {
    user: typeof user.$inferSelect | null;
    upVoteCount: number;
    downVoteCount: number;
    currentUserVote: VoteType | null;
  })[];
  metadata: {
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalPages: number;
    totalComments: number;
  };
}> => {
  "use cache";
  cacheTag(getMathProblemCommentTag(mathProblemId));

  const offset = (page - 1) * PAGE_SIZE;

  const sortByMap: Record<(typeof SORT_BY)[number], SQL<unknown>[]> = {
    most_recent: [desc(CommentTable.createdAt), desc(CommentTable.id)],
    oldest: [asc(CommentTable.createdAt), asc(CommentTable.id)],
  };

  const comments = await db
    .select({
      ...getTableColumns(CommentTable),
      user: getTableColumns(user),
      upVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${CommentVoteTable} cvt
        WHERE cvt.comment_id = ${CommentTable.id}
          AND cvt.type = ${"up"}
      )`,
      downVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${CommentVoteTable} cvt
        WHERE cvt.comment_id = ${CommentTable.id}
          AND cvt.type = ${"down"}
      )`,
      currentUserVote: sql<VoteType | null>`(
        SELECT cvt.type
        FROM ${CommentVoteTable} cvt
        JOIN ${CommentTable} ct ON ct.id = cvt.comment_id
        WHERE cvt.user_id = ${userId}
          AND cvt.comment_id = ${CommentTable.id}
      )`,
    })
    .from(CommentTable)
    .leftJoin(user, eq(user.id, CommentTable.userId))
    .where(eq(CommentTable.mathProblemId, mathProblemId))
    .orderBy(...sortByMap[sortBy])
    .offset(offset)
    .limit(PAGE_SIZE);

  const [total] = await db
    .select({
      count: count(),
    })
    .from(CommentTable)
    .where(eq(CommentTable.mathProblemId, mathProblemId));

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < total.count;
  const totalPages = Math.ceil(total.count / PAGE_SIZE);

  return {
    comments,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
      totalComments: total.count,
    },
  };
};

export const createComment = async (
  mathProblemId: string,
  unsafeData: CreateCommentSchemaType,
) => {
  const { userId } = await getCurrentUser();
  const { success, data } = createCommentSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await insertComment({ mathProblemId, ...data, userId });

  return {
    error: false,
    message: "Comment posted successfully!",
  };
};

export type GetCommentsType = ActionOutput<typeof getComments>;
