"use server";

import { getCurrentUser } from "@/lib/auth/auth-helpers";
import {
  createMathProblemSchema,
  CreateMathProblemSchemaType,
  mathProblemStatusSchema,
} from "./schemas";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import {
  insertMathProblem,
  updateMathProblems as updateMathProblemsDb,
  deleteMathProblems as deleteMathProblemsDb,
} from "../db/math-problems";
import { db } from "@/db/db";
import {
  CommentTable,
  MathProblemStatus,
  MathProblemTable,
  MathProblemVoteTable,
  user,
  VoteType,
} from "@/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  SQL,
  sql,
} from "drizzle-orm";
import { cacheTag } from "next/cache";
import {
  getMathProblemGlobalTag,
  getMathProblemIdTag,
  getUserMathProblemTag,
  revalidateMathProblemCache,
} from "../db/cache/math-problems";
import { ActionOutput } from "@/lib/types";
import { SORT_BY } from "../lib/params";
import { PAGE_SIZE } from "@/lib/constants";

export const createMathProblem = async (
  unsafeData: CreateMathProblemSchemaType,
) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || user?.role !== "admin") {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { success, data } = createMathProblemSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await insertMathProblem({ userId, ...data });

  return {
    error: false,
    message: "Math problem created successfully!",
  };
};

export const updateMathProblemsStatus = async (
  ids: string[],
  unsafeStatus: MathProblemStatus,
) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user || user.role !== "admin") {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { success, data } = mathProblemStatusSchema.safeParse(unsafeStatus);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await updateMathProblemsDb(ids, { status: data });

  return {
    error: false,
    message: "Math problem status updated successfully!",
  };
};

export const updateMathProblem = async (
  id: string,
  unsafeData: CreateMathProblemSchemaType,
) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user || user.role !== "admin") {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { success, data } = createMathProblemSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await updateMathProblemsDb([id], data);

  return {
    error: false,
    message: "Math problem updated successfully!",
  };
};

export const deleteMathProblems = async (ids: string[]) => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user || user.role !== "admin") {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  await deleteMathProblemsDb(ids);

  return {
    error: false,
    message: "Math problem deleted successfully!",
  };
};

export const getUserMathProblems = async (userId: string) => {
  "use cache";
  cacheTag(getUserMathProblemTag(userId));

  const mathProblems = await db
    .select({
      ...getTableColumns(MathProblemTable),
      commentCount: sql<number>`(
  SELECT COUNT(*)
  FROM ${CommentTable} ct
  WHERE ct.math_problem_id = ${MathProblemTable.id}
      )`,
      upVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${MathProblemVoteTable} mpvt
        WHERE mpvt.math_problem_id = ${MathProblemTable.id}
          AND mpvt.type = ${"up"}
      )`,
      downVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${MathProblemVoteTable} mpvt
        WHERE mpvt.math_problem_id = ${MathProblemTable.id}
          AND mpvt.type = ${"down"}
      )`,
    })
    .from(MathProblemTable)
    .where(eq(MathProblemTable.userId, userId))
    .orderBy(desc(MathProblemTable.createdAt), desc(MathProblemTable.id));

  return mathProblems;
};

const NEW_SORT_BY = [...SORT_BY, ""] as const;

export const getMathProblems = async ({
  page,
  sortBy,
  query,
}: {
  page: number;
  sortBy: (typeof NEW_SORT_BY)[number];
  query: string;
}) => {
  "use cache";
  cacheTag(getMathProblemGlobalTag());

  const offset = (page - 1) * PAGE_SIZE;

  const commentCount = sql<number>`(
        SELECT COUNT(*)
        FROM ${CommentTable} ct
        WHERE ct.math_problem_id = ${MathProblemTable.id}
      )`;

  const upVoteCount = sql<number>`(
        SELECT COUNT(*)
        FROM ${MathProblemVoteTable} mpvt
        WHERE mpvt.math_problem_id = ${MathProblemTable.id}
          AND mpvt.type = ${"up"}
      )`;

  const sortByMap: Record<(typeof NEW_SORT_BY)[number], SQL<unknown>[]> = {
    most_recent: [desc(MathProblemTable.createdAt), desc(MathProblemTable.id)],
    most_liked: [desc(upVoteCount), desc(MathProblemTable.id)],
    most_comments: [desc(commentCount), desc(MathProblemTable.id)],
    most_popular: [desc(MathProblemTable.views), desc(MathProblemTable.id)],
    oldest: [asc(MathProblemTable.createdAt), asc(MathProblemTable.id)],
    "": [desc(MathProblemTable.createdAt), desc(MathProblemTable.id)],
  };

  const whereQuery = and(
    eq(MathProblemTable.status, "published"),
    ilike(MathProblemTable.title, `%${query}%`),
  );

  const mathProblems = await db
    .select({
      ...getTableColumns(MathProblemTable),
      user: getTableColumns(user),
      commentCount,
      upVoteCount,
      downVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${MathProblemVoteTable} mpvt
        WHERE mpvt.math_problem_id = ${MathProblemTable.id}
          AND mpvt.type = ${"down"}
      )`,
    })
    .from(MathProblemTable)
    .innerJoin(user, eq(user.id, MathProblemTable.userId))
    .where(whereQuery)
    .orderBy(...sortByMap[sortBy])
    .offset(offset)
    .limit(PAGE_SIZE);

  const [total] = await db
    .select({
      count: count(),
    })
    .from(MathProblemTable)
    .where(whereQuery);

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < total.count;
  const totalPages = Math.floor(total.count / PAGE_SIZE);

  return {
    mathProblems,
    metadata: {
      hasNextPage,
      hasPrevPage,
      totalPages,
    },
  };
};

export const getOneMathProblem = async (
  userId: string | null,
  mathProblemId: string,
) => {
  "use cache";
  cacheTag(getMathProblemIdTag(mathProblemId));

  const [mathProblem] = await db
    .select({
      ...getTableColumns(MathProblemTable),
      user: getTableColumns(user),
      commentCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${CommentTable} ct
        WHERE ct.math_problem_id = ${MathProblemTable.id}
      )`,
      upVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${MathProblemVoteTable} mpvt
        WHERE mpvt.math_problem_id = ${MathProblemTable.id}
          AND mpvt.type = ${"up"}
      )`,
      downVoteCount: sql<number>`(
        SELECT COUNT(*)
        FROM ${MathProblemVoteTable} mpvt
        WHERE mpvt.math_problem_id = ${MathProblemTable.id}
          AND mpvt.type = ${"down"}
      )`,
      currentUserVote: sql<VoteType | null>`(
        SELECT mpvt.type
        FROM ${MathProblemVoteTable} mpvt
        JOIN ${MathProblemTable} mpt ON mpt.id = mpvt.math_problem_id
        WHERE mpvt.user_id = ${userId}
          AND mpvt.math_problem_id = ${MathProblemTable.id}
      )`,
    })
    .from(MathProblemTable)
    .innerJoin(user, eq(user.id, MathProblemTable.userId))
    .where(
      and(
        eq(MathProblemTable.id, mathProblemId),
        eq(MathProblemTable.status, "published"),
      ),
    );

  return mathProblem;
};

export const incrementMathProblemViewCount = async (id: string) => {
  const [updatedProblem] = await db
    .update(MathProblemTable)
    .set({
      views: sql`${MathProblemTable.views} + 1`,
    })
    .where(eq(MathProblemTable.id, id))
    .returning();

  revalidateMathProblemCache(updatedProblem);
};

export type GetMathProblemsType = ActionOutput<typeof getMathProblems>;

export type GetUserMathProblemsType = ActionOutput<typeof getUserMathProblems>;
