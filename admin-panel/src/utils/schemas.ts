import { z } from "zod";

// Skema Login (SAMA PERSIS kayak backend)
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginData = z.infer<typeof loginSchema>;

// ===================================================
// SKEMA PAKET (BARU)
// ===================================================

// Skema 'id' di URL (buat edit/delete)
export const paramsSchema = z.object({
  id: z.number().int().positive(),
});

export const createDokumentasiSchema = z.object({
  nama: z.string().min(3, "Nama paket wajib diisi"),
  deskripsi: z.string().min(10, "Deskripsi wajib diisi"),
  harga: z
    .number({ invalid_type_error: "Harga harus angka" })
    .min(1, "Harga wajib diisi"),
  jenis: z.enum(["photo"]), // (sesuai PDM)
  image_url: z.string().url("URL gambar tidak valid").optional().nullable(),
});
export type CreateDokumentasiData = z.infer<typeof createDokumentasiSchema>;

// Skema 'update' (semua field opsional)
export const updateDokumentasiSchema = createDokumentasiSchema.partial();
export type UpdateDokumentasiData = z.infer<typeof updateDokumentasiSchema>;

// --- ( LAKUKAN HAL YANG SAMA UNTUK 3 PAKET LAINNYA ) ---

export const createBusanaSchema = z.object({
  nama: z.string().min(3, "Nama paket wajib diisi"),
  deskripsi: z.string().min(10, "Deskripsi wajib diisi"),
  harga: z
    .number({ invalid_type_error: "Harga harus angka" })
    .min(1, "Harga wajib diisi"),
  image_url: z.string().url("URL gambar tidak valid").optional().nullable(),
});
export type CreateBusanaData = z.infer<typeof createBusanaSchema>;

// ... (import z) ...

// =I=================================================
// TAMBAHIN ENUM INI BIAR KITA PUNYA TIPE DATA STATUS
// ===================================================
export enum StatusPesananEnum {
  PENDING = 'PENDING',
  DITERIMA = 'DITERIMA',
  DITOLAK = 'DITOLAK',
  DIBATALKAN = 'DIBATALKAN',
}

// ... (sisa skema lo: loginSchema, paketSchema, dll) ...
// (Bikin juga 'updateBusanaSchema' pake .partial())
