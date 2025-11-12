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
const createBodySchema = z.object({
  nama: z.string({ required_error: "Nama paket wajib diisi" }).min(3),
  deskripsi: z.string({ required_error: "Deskripsi wajib diisi" }).min(10),
  harga: z.number({ required_error: "Harga wajib diisi" }).int().positive(),
  jenis: z.enum(["photo"], { required_error: "Jenis paket wajib 'photo'" }),
  image_url: z.string().url("URL gambar tidak valid").optional().nullable(),
});

export const createDokumentasiSchema = z.object({
  body: createBodySchema,
});

// ===================================================
// SKEMA UNTUK BODY (UPDATE)
// ===================================================
const updateBodySchema = createBodySchema.partial();

export const updateDokumentasiSchema = z.object({
  body: updateBodySchema,
  params: paketParamsSchema.shape.params, 
});


// ===================================================
// 1. SKEMA UNTUK BUSANA 
// ===================================================
// Skema Body (dipake ulang)
const busanaBodySchema = z.object({
  nama: z.string({ required_error: 'Nama paket wajib diisi' }).min(3),
  deskripsi: z.string({ required_error: 'Deskripsi wajib diisi' }).min(10),
  harga: z.number({ required_error: 'Harga wajib diisi' }).int().positive(),
  image_url: z.string().url('URL gambar tidak valid').optional().nullable(),
});

// Skema Create
export const createBusanaSchema = z.object({
  body: busanaBodySchema,
});

// Skema Update (semua field opsional)
export const updateBusanaSchema = z.object({
  body: busanaBodySchema.partial(),
  params: paketParamsSchema.shape.params,
});


// ===================================================
// 2. SKEMA UNTUK DEKORASI 
// ===================================================
const dekorasiBodySchema = z.object({
  nama: z.string({ required_error: 'Nama paket wajib diisi' }).min(3),
  deskripsi: z.string({ required_error: 'Deskripsi wajib diisi' }).min(10),
  harga: z.number({ required_error: 'Harga wajib diisi' }).int().positive(),
  jenis: z.enum(['koade'], { required_error: "Jenis paket wajib 'koade'" }), 
  image_url: z.string().url('URL gambar tidak valid').optional().nullable(),
});

export const createDekorasiSchema = z.object({
  body: dekorasiBodySchema,
});

export const updateDekorasiSchema = z.object({
  body: dekorasiBodySchema.partial(),
  params: paketParamsSchema.shape.params,
});




// ===================================================
// 3. SKEMA UNTUK AKAD & RESEPSI 
// ===================================================
const akadResepsiBodySchema = z.object({
  nama: z.string({ required_error: 'Nama paket wajib diisi' }).min(3),
  deskripsi: z.string({ required_error: 'Deskripsi wajib diisi' }).min(10),
  harga: z.number({ required_error: 'Harga wajib diisi' }).int().positive(),
  image_url: z.string().url('URL gambar tidak valid').optional().nullable(),
});

export const createAkadResepsiSchema = z.object({
  body: akadResepsiBodySchema,
});

export const updateAkadResepsiSchema = z.object({
  body: akadResepsiBodySchema.partial(),
  params: paketParamsSchema.shape.params,
});



// ===================================================
// TIPE DATA (buat di Controller/Service)
// ===================================================
export type CreateBusanaBody = z.infer<typeof createBusanaSchema>['body'];
export type UpdateBusanaBody = z.infer<typeof updateBusanaSchema>['body'];
export type CreateDekorasiBody = z.infer<typeof createDekorasiSchema>['body'];
export type UpdateDekorasiBody = z.infer<typeof updateDekorasiSchema>['body'];
export type CreateAkadResepsiBody = z.infer<typeof createAkadResepsiSchema>['body'];
export type UpdateAkadResepsiBody = z.infer<typeof updateAkadResepsiSchema>['body'];
export type PaginationQuery = z.infer<typeof paginationQuerySchema>["query"];
export type PaketParams = z.infer<typeof paketParamsSchema>["params"];
export type CreateDokumentasiBody = z.infer<
  typeof createDokumentasiSchema
>["body"];
export type UpdateDokumentasiBody = z.infer<typeof updateBodySchema>;
