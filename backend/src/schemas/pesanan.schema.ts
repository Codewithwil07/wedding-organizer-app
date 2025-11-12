import { z } from "zod";
import { paketParamsSchema } from "./paket.schema";

// ===================================================
// SKEMA UNTUK USER (Bikin Pesanan)
// ===================================================
export const createPesananSchema = z.object({
  body: z
    .object({
      // Bikin dia 'opsional' (boleh ga ada) DAN 'nullable' (boleh null)
      id_dokum: z.number().int().optional().nullable(), // <-- TAMBAHIN .nullable()
      id_busana: z.number().int().optional().nullable(), // <-- TAMBAHIN .nullable()
      id_dekorasi: z.number().int().optional().nullable(), // <-- TAMBAHIN .nullable()
      id_ar: z.number().int().optional().nullable(), // <-- TAMBAHIN .nullable()

      // Alamat & Tanggal
      alamat: z.string({ required_error: "Alamat wajib diisi" }),
      waktu_awal: z.coerce.date({
        required_error: "Tanggal mulai wajib diisi",
      }),
      waktu_akhir: z.coerce.date({
        required_error: "Tanggal akhir wajib diisi",
      }),
    })
    .refine(
      (data) =>
        data.id_dokum || data.id_busana || data.id_dekorasi || data.id_ar,
      {
        message: "Minimal harus ada satu paket yang dipilih",
      }
    ),
});

export type CreatePesananBody = z.infer<typeof createPesananSchema>["body"];

// ===================================================
// SKEMA UNTUK ADMIN (Update Status)
// ===================================================
export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["diterima", "ditolak", "pending", "dibatalkan"], {
      required_error: "Status wajib 'DITERIMA', 'DIBATALKAN' atau 'DITOLAK'",
    }),
  }),
  params: paketParamsSchema.shape.params, // Pinjem 'id'
});

export type UpdateStatusBody = z.infer<typeof updateStatusSchema>["body"];
