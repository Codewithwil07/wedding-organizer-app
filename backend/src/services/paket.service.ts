import prisma from "../lib/prisma";
import {
  CreateDokumentasiBody,
  UpdateDokumentasiBody,
  PaginationQuery,
  CreateBusanaBody,
  UpdateBusanaBody,
  CreateDekorasiBody,
  UpdateDekorasiBody,
  CreateAkadResepsiBody,
  UpdateAkadResepsiBody,
} from "../schemas/paket.schema";

export class PaketService {
  // === (C)REATE (ADMIN) ===x
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
  static async deleteDokumentasi(id: string) {
    await prisma.dokumentasi.delete({
      where: { id_dokum: parseInt(id) },
    });
    return; 
  }

  // ===================================================
  // MULAI CRUD BUSANA
  // ===================================================
  static async createBusana(data: CreateBusanaBody) {
    return prisma.busana.create({ data });
  }

  static async getAllBusanaAdmin(query: PaginationQuery) {
    const { cursor, limit } = query;
    const data = await prisma.busana.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id_busana: cursor }, skip: 1 }),
      orderBy: { id_busana: "asc" },
    });
    let nextCursor: number | null = null;
    if (data.length > limit) nextCursor = data.pop()!.id_busana;
    return { data, meta: { nextCursor, limit } };
  }

  static async getAllBusanaPublic(query: PaginationQuery) {
    const { cursor, limit } = query;
    const data = await prisma.busana.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id_busana: cursor }, skip: 1 }),
      orderBy: { id_busana: "asc" },
      select: { id_busana: true, nama: true, harga: true, image_url: true },
    });
    let nextCursor: number | null = null;
    if (data.length > limit) nextCursor = data.pop()!.id_busana;
    return { data, meta: { nextCursor, limit } };
  }

  static async getBusanaById(id: string) {
    return prisma.busana.findUniqueOrThrow({ where: { id_busana: parseInt(id) } });
  }

  static async updateBusana(id: string, data: UpdateBusanaBody) {
    return prisma.busana.update({ where: { id_busana: parseInt(id) }, data });
  }

  static async deleteBusana(id: string) {
    return prisma.busana.delete({ where: { id_busana: parseInt(id) } });
  }

  // ===================================================
  // MULAI CRUD DEKORASI
  // ===================================================
  static async createDekorasi(data: CreateDekorasiBody) {
    return prisma.dekorasi.create({ data });
  }

  static async getAllDekorasiAdmin(query: PaginationQuery) {
    const { cursor, limit } = query;
    const data = await prisma.dekorasi.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id_dekorasi: cursor }, skip: 1 }),
      orderBy: { id_dekorasi: "asc" },
    });
    let nextCursor: number | null = null;
    if (data.length > limit) nextCursor = data.pop()!.id_dekorasi;
    return { data, meta: { nextCursor, limit } };
  }

  static async getAllDekorasiPublic(query: PaginationQuery) {
    const { cursor, limit } = query;
    const data = await prisma.dekorasi.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id_dekorasi: cursor }, skip: 1 }),
      orderBy: { id_dekorasi: "asc" },
      select: {
        id_dekorasi: true,
        nama: true,
        harga: true,
        image_url: true,
        jenis: true,
      },
    });
    let nextCursor: number | null = null;
    if (data.length > limit) nextCursor = data.pop()!.id_dekorasi;
    return { data, meta: { nextCursor, limit } };
  }

  static async getDekorasiById(id: string) {
    return prisma.dekorasi.findUniqueOrThrow({ where: { id_dekorasi: parseInt(id) } });
  }

  static async updateDekorasi(id: string, data: UpdateDekorasiBody) {
    return prisma.dekorasi.update({ where: { id_dekorasi: parseInt(id) }, data });
  }

  static async deleteDekorasi(id: string) {
    return prisma.dekorasi.delete({ where: { id_dekorasi: parseInt(id) } });
  }

  // ===================================================
  // MULAI CRUD AKAD & RESEPSI
  // ===================================================
  static async createAkadResepsi(data: CreateAkadResepsiBody) {
    return prisma.akadResepsi.create({ data });
  }

  static async getAllAkadResepsiAdmin(query: PaginationQuery) {
    const { cursor, limit } = query;
    const data = await prisma.akadResepsi.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id_ar: cursor }, skip: 1 }),
      orderBy: { id_ar: "asc" },
    });
    let nextCursor: number | null = null;
    if (data.length > limit) nextCursor = data.pop()!.id_ar;
    return { data, meta: { nextCursor, limit } };
  }

  static async getAllAkadResepsiPublic(query: PaginationQuery) {
    const { cursor, limit } = query;
    const data = await prisma.akadResepsi.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id_ar: cursor }, skip: 1 }),
      orderBy: { id_ar: "asc" },
      select: { id_ar: true, nama: true, harga: true, image_url: true },
    });
    let nextCursor: number | null = null;
    if (data.length > limit) nextCursor = data.pop()!.id_ar;
    return { data, meta: { nextCursor, limit } };
  }

  static async getAkadResepsiById(id: string) {
    return prisma.akadResepsi.findUniqueOrThrow({ where: { id_ar: parseInt(id) } });
  }

  static async updateAkadResepsi(id: string, data: UpdateAkadResepsiBody) {
    return prisma.akadResepsi.update({ where: { id_ar: parseInt(id) }, data });
  }

  static async deleteAkadResepsi(id: string) {
    return prisma.akadResepsi.delete({ where: { id_ar: parseInt(id) } });
  }
}
