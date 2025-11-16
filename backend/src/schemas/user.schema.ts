import { email, z } from "zod";

// Skema 'update' profil. Semua opsional.
export const updateProfileSchema = z.object({
  body: z
    .object({
      username: z.string().min(3, "Nama harus diisi").optional(),
      email: z.email({ message: "format email tidak valid" }),
      password: z.string().min(6, "Password minimal 6 karakter").optional(),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.password) {
          return data.password === data.confirmPassword;
        }
        return true; // Kalo 'password' ga diisi, lolos
      },
      {
        message: "Password tidak cocok",
        path: ["confirmPassword"], // Kasi error ke field 'confirmPassword'
      }
    ),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>["body"];
