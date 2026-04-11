"use server";

import { VoteType, voteTypes } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { INVALID_DATA_MESSAGE, UNAUTHED_MESSAGE } from "@/lib/auth/constants";
import z from "zod";
import { insertProblemVote } from "../db/problem-votes";

export const voteOnProblem = async (
  mathProblemId: string,
  unsafeType: VoteType,
) => {
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

  await insertProblemVote({ mathProblemId, userId, type: data });

  return {
    error: false,
    message: "Vote updated successfully!",
  };
};
