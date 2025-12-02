import { z } from 'zod';
import { paketParamsSchema } from './paket.schema';

// User kirim kritik
export const createKritikSchema = z.object({
  body: z.object({
    isi: z.string().min(5, 'Pesan kritik/saran minimal 5 karakter'),
  }),
});

// Admin balas kritik
export const replyKritikSchema = z.object({
  body: z.object({
    balasan: z.string().min(5, 'Balasan minimal 5 karakter'),
  }),
  params: paketParamsSchema.shape.params, // Validasi ID
});

export type CreateKritikBody = z.infer<typeof createKritikSchema>['body'];
export type ReplyKritikBody = z.infer<typeof replyKritikSchema>['body'];