import { mathProblemStatuses } from "@/db/schema";
import z from "zod";

export const mathProblemStatusSchema = z.enum(mathProblemStatuses);

export const createMathProblemSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a title." }),
  status: mathProblemStatusSchema,
  content: z
    .string()
    .trim()
    .min(1, { error: "Please enter at least 10 characters of content." }),
});
export type CreateMathProblemSchemaType = z.infer<
  typeof createMathProblemSchema
>;
