import prisma from "../lib/prisma";
import { CreatePesananBody, UpdateStatusBody } from "../schemas/pesanan.schema";
import { PaginationQuery } from "../schemas/paket.schema";
import { StatusPesananEnum, User } from "@prisma/client";

export class PesananService {
  // ===================================================
  // UNTUK USER (APP)
  // ===================================================

  /**
   * (USER) Bikin pesanan baru
   */
  static async createPesanan(data: CreatePesananBody, userId: number) {
    const {
      id_dokum,
      id_busana,
      id_dekorasi,
      id_ar,
      alamat,
      waktu_awal,
      waktu_akhir,
    } = data;

    // 1. HITUNG TOTAL HARGA (BIAR AMAN, DI SISI SERVER)
    let totalHarga = 0;
    if (id_dokum) {
      const paket = await prisma.dokumentasi.findUnique({
        where: { id_dokum },
      });
      totalHarga += paket?.harga || 0;
    }
    if (id_busana) {
      const paket = await prisma.busana.findUnique({ where: { id_busana } });
      totalHarga += paket?.harga || 0;
    }
    if (id_dekorasi) {
      const paket = await prisma.dekorasi.findUnique({
        where: { id_dekorasi },
      });
      totalHarga += paket?.harga || 0;
    }
    if (id_ar) {
      const paket = await prisma.akadResepsi.findUnique({ where: { id_ar } });
      totalHarga += paket?.harga || 0;
    }

    // 2. Buat Pesanan
    const pesananBaru = await prisma.pesanan.create({
      data: {
        id_user: userId, // <-- Ambil dari user yg login
        status: StatusPesananEnum.pending, // <-- Default
        harga: totalHarga,
        alamat,
        waktu_awal,
        waktu_akhir,
        // Sambungin ke paket-paket yg dipilih
        id_dokum,
        id_busana,
        id_dekorasi,
        id_ar,
      },
    });

    return pesananBaru;
  }

  /**
   * (USER) Liat history pesanan dia sendiri
   */
  static async getPesananByUserId(userId: number) {
    return prisma.pesanan.findMany({
      where: { id_user: userId },
      orderBy: { waktu_awal: "desc" }, // Tampilin yg paling baru
      // 'include' > 'select'. Kita mau semua data pesanan
      // DAN data paket-paketnya
      include: {
        dokumentasi: { select: { nama: true, harga: true, image_url: true } },
        busana: { select: { nama: true, harga: true, image_url: true } },
        dekorasi: { select: { nama: true, harga: true, image_url: true } },
        akadResepsi: { select: { nama: true, harga: true, image_url: true } },
      },
    });
  }

  /**
   * (USER) Batalin pesanan dia sendiri
   */
  static async cancelPesanan(pesananId: string, userId: string) {
    // 1. CEK KEAMANAN: Pesanan ini punya dia bukan?
    const pesanan = await prisma.pesanan.findUniqueOrThrow({
      where: { id_pesan: parseInt(pesananId) },
    });

    if (pesanan.id_user !== parseInt(userId)) {
      // Kalo user A nyoba hapus pesanan user B
      throw new Error("FORBIDDEN"); // Nanti ditangkep Global Handler
    }

    // 2. CEK LOGIKA: Cuma yg PENDING yg boleh dibatalin
    if (pesanan.status !== StatusPesananEnum.pending) {
      throw new Error("BOOKING_CONFIRMED"); // Nanti ditangkep
    }

    // 3. Kalo aman, hapus
    await prisma.pesanan.update({
      where: { id_pesan: parseInt(pesananId) },
      data: {
        status: StatusPesananEnum.dibatalkan,
      },
    });
    return;
  }

  // ===================================================
  // UNTUK ADMIN (WEB)
  // ===================================================

  /**
   * (ADMIN) Liat semua pesanan
   */
  static async getAllPesananAdmin(query: PaginationQuery) {
    const { cursor, limit } = query;

    const data = await prisma.pesanan.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id_pesan: cursor },
        skip: 1,
      }),
      orderBy: { id_pesan: "desc" }, // Tampilkan yg terbaru
      include: {
        user: { select: { username: true, email: true } }, // Tampilkan info user
      },
    });

    let nextCursor: number | null = null;
    if (data.length > limit) {
      nextCursor = data.pop()!.id_pesan;
    }

    return { data, meta: { nextCursor, limit } };
  }

  /**
   * (ADMIN) Update status pesanan (Terima/Tolak)
   */
  static async updatePesananStatus(id: string, status: StatusPesananEnum) {
    const pesanan = await prisma.pesanan.findUniqueOrThrow({
      where: { id_pesan: parseInt(id) },
    });

    if (pesanan.status !== StatusPesananEnum.pending) {
      throw new Error("PESANAN_ALREADY_PROCESSED");
    }

    return prisma.pesanan.update({
      where: { id_pesan: parseInt(id) },
      data: {
        status: status,
      },
    });
  }
}
