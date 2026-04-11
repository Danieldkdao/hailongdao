import z from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(10, { error: "Please enter at least 10 characters." }),
});
export type CreateCommentSchemaType = z.infer<typeof createCommentSchema>;
