import z from "zod";

export const registerAuthSchema = z.object({
  email: z.email(),
  fullname: z.string().min(6),
  password: z.string().min(6),
});
