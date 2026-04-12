import { MathProblemDifficultyLevel, mathProblemStatuses } from "@/db/schema";
import z from "zod";

export const mathProblemStatusSchema = z.enum(mathProblemStatuses);

export const mathProblemDifficultyLevelSchema =
  z.custom<MathProblemDifficultyLevel>();

export const createMathProblemSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a title." }),
  status: mathProblemStatusSchema,
  difficultyLevel: z.custom<MathProblemDifficultyLevel>(),
  keywords: z.array(z.string()),
  content: z
    .string()
    .trim()
    .min(1, { error: "Please enter at least 10 characters of content." }),
});
export type CreateMathProblemSchemaType = z.infer<
  typeof createMathProblemSchema
>;
