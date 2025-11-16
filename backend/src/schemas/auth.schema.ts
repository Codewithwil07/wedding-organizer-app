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


export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email wajib diisi',
    }).email('Format email tidak valid'),
  }),
});

// ===================================================
// SKEMA BARU: RESET PASSWORD [cite: 686, 689]
// ===================================================
export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    // 'token' ini adalah 6-digit OTP
    token: z.string().min(6, 'Token harus 6 digit').max(6, 'Token harus 6 digit'),
    password: z.string().min(6, 'Password baru minimal 6 karakter'),
  }),
});

// Tipe data baru
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>['body'];
