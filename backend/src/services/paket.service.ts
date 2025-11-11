import prisma from "../lib/prisma";
import {
  CreateDokumentasiBody,
  UpdateDokumentasiBody,
  PaginationQuery,
} from "../schemas/paket.schema";

export class PaketService {
  // === (C)REATE (ADMIN) ===
  static async createDokumentasi(data: CreateDokumentasiBody) {
    return prisma.dokumentasi.create({
      data: data,
    });
  }

  // === (R)EAD: GET ALL (ADMIN) ===
  static async getAllDokumentasiAdmin(query: PaginationQuery) {
    const { cursor, limit } = query;

    const data = await prisma.dokumentasi.findMany({
      take: limit + 1, // Ambil 1 data ekstra
      ...(cursor && {
        cursor: { id_dokum: cursor },
        skip: 1,
      }),
      orderBy: { id_dokum: "asc" },
    });

    let nextCursor: number | null = null;
    if (data.length > limit) {
      const nextItem = data.pop(); // Hapus & ambil data ekstra
      nextCursor = nextItem!.id_dokum;
    }

    return { data, meta: { nextCursor, limit } };
  }

  // === (R)EAD: GET ALL (PUBLIC) ===
  static async getAllDokumentasiPublic(query: PaginationQuery) {
    const { cursor, limit } = query;

    const data = await prisma.dokumentasi.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id_dokum: cursor },
        skip: 1,
      }),
      orderBy: { id_dokum: "asc" },
      select: {
        // App publik ga perlu semua data
        id_dokum: true,
        nama: true,
        harga: true,
        image_url: true,
      },
    });

    let nextCursor: number | null = null;
    if (data.length > limit) {
      const nextItem = data.pop();
      nextCursor = nextItem!.id_dokum;
    }

    return { data, meta: { nextCursor, limit } };
  }

  // === (R)EAD: GET BY ID (PUBLIC/ADMIN) ===
  static async getDokumentasiById(id: string) {
    // 'findUniqueOrThrow' otomatis lempar error P2025 kalo ga nemu
    return prisma.dokumentasi.findUniqueOrThrow({
      where: { id_dokum: parseInt(id) },
    });
  }

  // === (U)PDATE (ADMIN) ===
  static async updateDokumentasi(id: string, data: UpdateDokumentasiBody) {
    return prisma.dokumentasi.update({
      where: { id_dokum: parseInt(id) },
      data: data,
    });
  }

  // === (D)ELETE (ADMIN) ===
  static async deleteDokumentasi(id: number) {
    // 'delete' juga otomatis error P2025 kalo ga nemu
    await prisma.dokumentasi.delete({
      where: { id_dokum: id },
    });
    return; // Delete ga perlu balikin apa-apa
  }
}
