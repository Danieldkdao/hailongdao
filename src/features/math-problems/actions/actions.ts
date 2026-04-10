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
import { insertMathProblem, updateMathProblem } from "../db/math-problems";
import { db } from "@/db/db";
import {
  CommentTable,
  MathProblemStatus,
  MathProblemTable,
  MathProblemVoteTable,
} from "@/db/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getUserMathProblemTag } from "../db/cache/math-problems";
import { ActionOutput } from "@/lib/types";

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

export const updateMathProblemStatus = async (
  id: string,
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

  await updateMathProblem(id, { status: data });

  return {
    error: false,
    message: "Math problem status updated successfully!",
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
export type GetUserMathProblemsType = ActionOutput<typeof getUserMathProblems>;
