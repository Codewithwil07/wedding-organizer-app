import { z } from "zod";

// ===================================================
// SKEMA UNTUK PAGINATION QUERY
// ===================================================
export const paginationQuerySchema = z.object({
  query: z.object({
    // Kita cuma validasi kalo dia string, sisanya urusan controller
    cursor: z.string().optional(),
    limit: z.string().optional(),
  }),
});

// ===================================================
// SKEMA UNTUK PARAMS (:id)
// ===================================================
export const paketParamsSchema = z.object({
  params: z.object({
    // 'id' itu string dari URL, kita ubah jadi angka
    id: z
      .string({ required_error: "ID paket wajib diisi" })
      .transform((val) => Number(val)),
  }),
});

// ===================================================
// SKEMA UNTUK BODY (CREATE)
// ===================================================
// Ini skema body CREATE (semua field wajib, kecuali URL)
const createBodySchema = z.object({
  nama: z.string({ required_error: "Nama paket wajib diisi" }).min(3),
  deskripsi: z.string({ required_error: "Deskripsi wajib diisi" }).min(10),
  harga: z.number({ required_error: "Harga wajib diisi" }).int().positive(),
  jenis: z.enum(["photo"], { required_error: "Jenis paket wajib 'photo'" }),
  image_url: z.string().url("URL gambar tidak valid").optional().nullable(),
});

// Ini skema full CREATE (body-nya wajib)
export const createDokumentasiSchema = z.object({
  body: createBodySchema,
});

// ===================================================
// SKEMA UNTUK BODY (UPDATE)
// ===================================================
// Ini skema body UPDATE (semua field opsional)
const updateBodySchema = createBodySchema.partial();

// Ini skema full UPDATE (body opsional, params wajib)
export const updateDokumentasiSchema = z.object({
  body: updateBodySchema,
  params: paketParamsSchema.shape.params, // Ambil 'params' dari skema di atas
});

// ===================================================
// TIPE DATA (buat di Controller/Service)
// ===================================================
export type PaginationQuery = z.infer<typeof paginationQuerySchema>["query"];
export type PaketParams = z.infer<typeof paketParamsSchema>["params"];
export type CreateDokumentasiBody = z.infer<
  typeof createDokumentasiSchema
>["body"];
export type UpdateDokumentasiBody = z.infer<typeof updateBodySchema>;
