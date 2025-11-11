import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: "Username wajib diisi" })
      .min(3, { message: "Username minimal 3 karakter" }),

    email: z
      .string({ required_error: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" }),

    password: z
      .string({ required_error: "Password wajib diisi" })
      .min(6, { message: "Password minimal 6 karakter" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" }),

    password: z.string({ required_error: "Password wajib diisi" }),
  }),
});

export type RegisterBody = z.infer<typeof registerSchema>["body"];
export type LoginBody = z.infer<typeof loginSchema>["body"];
