import { z } from 'zod';
import { paketParamsSchema } from './paket.schema'; // Pinjem validasi ID

// Skema Body (Create/Update)
const beritaBodySchema = z.object({
  judul: z.string().min(5, 'Judul berita minimal 5 karakter'),
  isi: z.string().min(10, 'Isi berita minimal 10 karakter'),
  image_url: z.string().min(1, 'URL gambar wajib').optional().nullable(),
});

// Skema Create
export const createBeritaSchema = z.object({
  body: beritaBodySchema,
});

// Skema Update
export const updateBeritaSchema = z.object({
  body: beritaBodySchema.partial(),
  params: paketParamsSchema.shape.params,
});

// Export Tipe Data
export type CreateBeritaBody = z.infer<typeof createBeritaSchema>['body'];
export type UpdateBeritaBody = z.infer<typeof updateBeritaSchema>['body'];