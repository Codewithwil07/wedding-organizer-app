import { z } from "zod";

// ===================================================
// SKEMA OTENTIKASI (AUTH)
// ===================================================
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginData = z.infer<typeof loginSchema>;

// ===================================================
// ENUM (Biar Tipe Data Aman)
// ===================================================
export enum StatusPesananEnum {
  pending = "pending",
  diterima = "diterima",
  ditolak = "ditolak",
  dibatalkan = "dibatalkan",
}

// ===================================================
// SKEMA REUSABLE (Umum)
// ===================================================
// Skema 'id' di URL (buat edit/delete)
export const paketParamsSchema = z.object({
  // 'id' di controller udah 'number', tapi kita validasi lagi
  id: z.number().int().positive(),
});
export type PaketParams = z.infer<typeof paketParamsSchema>;

// ===================================================
// SKEMA PAKET: DOKUMENTASI [cite: 620-623]
// ===================================================
export const createDokumentasiSchema = z.object({
  nama: z.string().min(3, "Nama paket wajib diisi"),
  deskripsi: z.string().min(10, "Deskripsi wajib diisi"),
  harga: z
    .number({ invalid_type_error: "Harga harus angka" })
    .min(1, "Harga wajib diisi"),
  jenis: z.enum(["photo"]), // (Sesuai PDM)
  image_url: z.string().min(1, "URL gambar tidak valid").optional().nullable(),
});
export type CreateDokumentasiData = z.infer<typeof createDokumentasiSchema>;

// Skema update (semua field opsional)
export const updateDokumentasiSchema = createDokumentasiSchema.partial();
export type UpdateDokumentasiData = z.infer<typeof updateDokumentasiSchema>;

// ===================================================
// SKEMA PAKET: BUSANA & MUA [cite: 630-632] (Tidak ada 'jenis')
// ===================================================
export const createBusanaSchema = z.object({
  nama: z.string().min(3, "Nama paket wajib diisi"),
  deskripsi: z.string().min(10, "Deskripsi wajib diisi"),
  harga: z
    .number({ invalid_type_error: "Harga harus angka" })
    .min(1, "Harga wajib diisi"),
  image_url: z.string().min(1, "URL gambar tidak valid").optional().nullable(),
    
});
export type CreateBusanaData = z.infer<typeof createBusanaSchema>;

export const updateBusanaSchema = createBusanaSchema.partial();
export type UpdateBusanaData = z.infer<typeof updateBusanaSchema>;

// ===================================================
// SKEMA PAKET: DEKORASI [cite: 643-647] (Jenis: 'koade')
// ===================================================
export const createDekorasiSchema = z.object({
  nama: z.string().min(3, "Nama paket wajib diisi"),
  deskripsi: z.string().min(10, "Deskripsi wajib diisi"),
  harga: z
    .number({ invalid_type_error: "Harga harus angka" })
    .min(1, "Harga wajib diisi"),
  jenis: z.enum(["koade"]), // (Sesuai PDM)
  image_url: z.string().min(1, "URL gambar tidak valid").optional().nullable(),
  });
export type CreateDekorasiData = z.infer<typeof createDekorasiSchema>;

export const updateDekorasiSchema = createDekorasiSchema.partial();
export type UpdateDekorasiData = z.infer<typeof updateDekorasiSchema>;

// ===================================================
// SKEMA PAKET: AKAD & RESEPSI [cite: 648-650] (Tidak ada 'jenis')
// ===================================================
export const createAkadResepsiSchema = z.object({
  nama: z.string().min(3, "Nama paket wajib diisi"),
  deskripsi: z.string().min(10, "Deskripsi wajib diisi"),
  harga: z
    .number({ invalid_type_error: "Harga harus angka" })
    .min(1, "Harga wajib diisi"),
  image_url: z.string().min(1, "URL gambar tidak valid").optional().nullable(),
  });
export type CreateAkadResepsiData = z.infer<typeof createAkadResepsiSchema>;

export const updateAkadResepsiSchema = createAkadResepsiSchema.partial();
export type UpdateAkadResepsiData = z.infer<typeof updateAkadResepsiSchema>;
