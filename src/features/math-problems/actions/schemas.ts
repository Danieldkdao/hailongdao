import z from "zod";

export const createMathProblemSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a title." }),
  content: z
    .string()
    .trim()
    .min(1, { error: "Please enter at least 10 characters of content." }),
});
export type CreateMathProblemSchemaType = z.infer<
  typeof createMathProblemSchema
>;
