"use server";

import { getCurrentUser } from "@/lib/auth/auth-helpers";
import {
  createMathProblemSchema,
  CreateMathProblemSchemaType,
} from "./schemas";
import { INVALID_DATA_MESSAGE, UNAUTHED_MESSAGE } from "@/lib/auth/constants";
import { insertMathProblem } from "../db/math-problems";

export const createMathProblem = async (
  unsafeData: CreateMathProblemSchemaType,
) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: UNAUTHED_MESSAGE,
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
