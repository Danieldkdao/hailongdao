"use server";

import { cacheTag } from "next/cache";
import { getMathProblemCommentTag } from "../db/cache/comments";
import { db } from "@/db/db";
import { CommentTable, user } from "@/db/schema";
import { asc, count, desc, eq, getTableColumns, SQL } from "drizzle-orm";
import { PAGE_SIZE } from "@/lib/constants";
import { SORT_BY } from "../lib/params";
import { ActionOutput } from "@/lib/types";
import { createCommentSchema, CreateCommentSchemaType } from "./schemas";
import { INVALID_DATA_MESSAGE } from "@/lib/auth/constants";
import { insertComment } from "../db/comments";
import { getCurrentUser } from "@/lib/auth/auth-helpers";

export const getComments = async ({
  mathProblemId,
  page,
  sortBy,
}: {
  mathProblemId: string;
  page: number;
  sortBy: (typeof SORT_BY)[number];
}): Promise<{
  comments: (typeof CommentTable.$inferSelect & {
    user: typeof user.$inferSelect | null;
  })[];
  metadata: {
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalPages: number;
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
  const totalPages = Math.floor(total.count / PAGE_SIZE);

  return {
    comments,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
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
