import z from "zod";

export const passwordSchema = z.object({
  password: z.string().min(1),
});
export type PasswordSchemaType = z.infer<typeof passwordSchema>;
