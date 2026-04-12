import {
  MathProblemDifficultyLevel,
  mathProblemProblemStatuses,
  mathProblemStatuses,
  MathProblemTable,
} from "@/db/schema";
import z from "zod";

export const updateMathProblemsSchema =
  z.custom<Partial<typeof MathProblemTable.$inferSelect>>();

export const createMathProblemSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a title." }),
  status: z.enum(mathProblemStatuses),
  difficultyLevel: z.custom<MathProblemDifficultyLevel>(),
  keywords: z.array(z.string()),
  problemStatus: z.enum(mathProblemProblemStatuses),
  content: z
    .string()
    .trim()
    .min(1, { error: "Please enter at least 10 characters of content." }),
});
export type CreateMathProblemSchemaType = z.infer<
  typeof createMathProblemSchema
>;
