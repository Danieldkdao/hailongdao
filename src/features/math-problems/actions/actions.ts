"use server";

import { db } from "@/db/db";
import {
  CommentTable,
  KeywordTable,
  MathProblemDifficultyLevel,
  MathProblemKeywordTable,
  MathProblemProblemStatus,
  MathProblemTable,
  MathProblemVoteTable,
  user,
  VoteType,
} from "@/db/schema";
import {
  insertMathProblemKeywords,
  updateMathProblemKeywords,
} from "@/features/keywords/actions/actions";
import { hasPermissionForUser } from "@/features/user/lib/permissions";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { PAGE_SIZE } from "@/lib/constants";
import { ActionOutput } from "@/lib/types";
import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  getTableColumns,
  ilike,
  inArray,
  or,
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
import {
  deleteMathProblems as deleteMathProblemsDb,
  insertMathProblem,
  updateMathProblems as updateMathProblemsDb,
} from "../db/math-problems";
import { SORT_BY } from "../lib/params";
import {
  createMathProblemSchema,
  CreateMathProblemSchemaType,
  updateMathProblemsSchema,
} from "./schemas";

const getAuthorizedMathProblemUser = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user) return null;

  return {
    user,
    userId,
  };
};

const userOwnsMathProblems = async (userId: string, ids: string[]) => {
  if (ids.length === 0) return false;

  const [result] = await db
    .select({
      count: count(),
    })
    .from(MathProblemTable)
    .where(
      and(
        inArray(MathProblemTable.id, ids),
        eq(MathProblemTable.userId, userId),
      ),
    );

  return result.count === ids.length;
};

const requireMathProblemPermission = async ({
  ownPermission,
  allPermission,
  ids,
}: {
  ownPermission: "create" | "read" | "update" | "delete";
  allPermission?: "read-all" | "update-all" | "delete-all";
  ids?: string[];
}) => {
  const authorizedUser = await getAuthorizedMathProblemUser();
  if (!authorizedUser) {
    return {
      error: true as const,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { user, userId } = authorizedUser;
  const hasAllPermission = allPermission
    ? await hasPermissionForUser({
        permissions: { mathProblem: [allPermission] },
        role: user.role,
        userId,
      })
    : false;

  if (hasAllPermission) {
    return {
      error: false as const,
      user,
      userId,
    };
  }

  const hasOwnPermission = await hasPermissionForUser({
    permissions: { mathProblem: [ownPermission] },
    role: user.role,
    userId,
  });
  if (!hasOwnPermission) {
    return {
      error: true as const,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  if (ids?.length && !(await userOwnsMathProblems(userId, ids))) {
    return {
      error: true as const,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  return {
    error: false as const,
    user,
    userId,
  };
};

export const createMathProblem = async (
  unsafeData: CreateMathProblemSchemaType,
) => {
  const authorizedUser = await requireMathProblemPermission({
    ownPermission: "create",
  });
  if (authorizedUser.error) return authorizedUser;

  const { success, data } = createMathProblemSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  const { keywords, ...mathProblem } = data;

  const insertedMathProblem = await insertMathProblem({
    userId: authorizedUser.userId,
    ...mathProblem,
  });
  if (insertedMathProblem?.id) {
    await insertMathProblemKeywords(insertedMathProblem.id, keywords);
    revalidateMathProblemCache(insertedMathProblem);
  }

  return {
    error: false,
    message: "Math problem created successfully!",
  };
};

export const updateMathProblems = async (
  ids: string[],
  unsafeData: Partial<typeof MathProblemTable.$inferSelect>,
) => {
  const authorizedUser = await requireMathProblemPermission({
    ownPermission: "update",
    allPermission: "update-all",
    ids,
  });
  if (authorizedUser.error) return authorizedUser;

  const { success, data } = updateMathProblemsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await updateMathProblemsDb(ids, data);

  return {
    error: false,
    message: "Math problem status updated successfully!",
  };
};

export const updateMathProblem = async (
  id: string,
  unsafeData: CreateMathProblemSchemaType,
) => {
  const authorizedUser = await requireMathProblemPermission({
    ownPermission: "update",
    allPermission: "update-all",
    ids: [id],
  });
  if (authorizedUser.error) return authorizedUser;

  const { success, data } = createMathProblemSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  const { keywords, ...mathProblem } = data;

  const updatedMathProblem = await updateMathProblemsDb([id], mathProblem);
  if (updatedMathProblem?.id) {
    await updateMathProblemKeywords(updatedMathProblem.id, keywords);
    revalidateMathProblemCache(updatedMathProblem);
  }

  return {
    error: false,
    message: "Math problem updated successfully!",
  };
};

export const deleteMathProblems = async (ids: string[]) => {
  const authorizedUser = await requireMathProblemPermission({
    ownPermission: "delete",
    allPermission: "delete-all",
    ids,
  });
  if (authorizedUser.error) return authorizedUser;

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
      keywords: sql<{ id: string; keyword: string }[]>`(
        SELECT COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'id', keywords.keyword_id,
                'keyword', keywords.keyword
              )
            ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            kt.id AS keyword_id,
            kt.keyword AS keyword
          FROM ${MathProblemKeywordTable} mpkt
          JOIN ${KeywordTable} kt ON kt.id = mpkt.keyword_id
          WHERE mpkt.math_problem_id = "math_problems"."id"
        ) AS keywords
      )`,
    })
    .from(MathProblemTable)
    .where(eq(MathProblemTable.userId, userId))
    .orderBy(desc(MathProblemTable.createdAt), desc(MathProblemTable.id));

  return mathProblems;
};

export const getAllMathProblems = async () => {
  "use cache";
  cacheTag(getMathProblemGlobalTag());

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
      keywords: sql<{ id: string; keyword: string }[]>`(
        SELECT COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'id', keywords.keyword_id,
                'keyword', keywords.keyword
              )
            ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            kt.id AS keyword_id,
            kt.keyword AS keyword
          FROM ${MathProblemKeywordTable} mpkt
          JOIN ${KeywordTable} kt ON kt.id = mpkt.keyword_id
          WHERE mpkt.math_problem_id = "math_problems"."id"
        ) AS keywords
      )`,
    })
    .from(MathProblemTable)
    .orderBy(desc(MathProblemTable.createdAt), desc(MathProblemTable.id));

  return mathProblems;
};

type MathProblemSortBy = (typeof SORT_BY)[number] | "";

export const getMathProblems = async ({
  page,
  sortBy,
  query,
  difficultyLevels,
  problemStatuses,
}: {
  page: number;
  sortBy: MathProblemSortBy;
  query: string;
  difficultyLevels: MathProblemDifficultyLevel[];
  problemStatuses: MathProblemProblemStatus[];
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

  const sortByMap: Record<MathProblemSortBy, SQL<unknown>[]> = {
    most_recent: [desc(MathProblemTable.createdAt), desc(MathProblemTable.id)],
    most_liked: [desc(upVoteCount), desc(MathProblemTable.id)],
    most_comments: [desc(commentCount), desc(MathProblemTable.id)],
    most_popular: [desc(MathProblemTable.views), desc(MathProblemTable.id)],
    oldest: [asc(MathProblemTable.createdAt), asc(MathProblemTable.id)],
    "": [desc(MathProblemTable.createdAt), desc(MathProblemTable.id)],
  };

  const whereQuery = and(
    eq(MathProblemTable.status, "published"),
    or(
      ilike(MathProblemTable.title, `%${query}%`),
      exists(
        db
          .select({ one: sql`1` })
          .from(MathProblemKeywordTable)
          .innerJoin(
            KeywordTable,
            eq(KeywordTable.id, MathProblemKeywordTable.keywordId),
          )
          .where(
            and(
              eq(MathProblemKeywordTable.mathProblemId, MathProblemTable.id),
              ilike(KeywordTable.keyword, `%${query}%`),
            ),
          ),
      ),
    ),
    difficultyLevels.length
      ? inArray(MathProblemTable.difficultyLevel, difficultyLevels)
      : undefined,
    problemStatuses.length
      ? inArray(MathProblemTable.problemStatus, problemStatuses)
      : undefined,
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
      keywords: sql<{ id: string; keyword: string }[]>`(
        SELECT COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'id', keywords.keyword_id,
                'keyword', keywords.keyword
              )
            ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            kt.id AS keyword_id,
            kt.keyword AS keyword
          FROM ${MathProblemKeywordTable} mpkt
          JOIN ${KeywordTable} kt ON kt.id = mpkt.keyword_id
          WHERE mpkt.math_problem_id = "math_problems"."id"
        ) AS keywords
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
      keywords: sql<{ id: string; keyword: string }[]>`(
        SELECT COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'id', keywords.keyword_id,
                'keyword', keywords.keyword
              )
            ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            kt.id AS keyword_id,
            kt.keyword AS keyword
          FROM ${MathProblemKeywordTable} mpkt
          JOIN ${KeywordTable} kt ON kt.id = mpkt.keyword_id
          WHERE mpkt.math_problem_id = ${mathProblemId}
        ) AS keywords
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
