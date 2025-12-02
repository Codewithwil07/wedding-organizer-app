import prisma from '../lib/prisma';
import { CreateKritikBody, ReplyKritikBody } from '../schemas/kritik.schema';

export class KritikService {
  
  // (USER) Kirim Kritik Baru
  static async createKritik(userId: number, data: CreateKritikBody) {
    return prisma.kritikSaran.create({
      data: {
        isi: data.isi,
        id_user: userId,
        // balasan: null (default)
      },
    });
  }

  // (USER) Liat Kritik Saya (dan balasannya)
  static async getMyKritik(userId: number) {
    return prisma.kritikSaran.findMany({
      where: { id_user: userId },
      orderBy: { tanggal: 'desc' },
    });
  }

  // (ADMIN) Liat SEMUA Kritik
  static async getAllKritik() {
    return prisma.kritikSaran.findMany({
      orderBy: { tanggal: 'desc' },
      include: {
        user: { select: { username: true, email: true } }
      }
    });
  }

  // (ADMIN) Balas Kritik
  static async replyKritik(id: number, data: ReplyKritikBody) {
    return prisma.kritikSaran.update({
      where: { id_ks: id },
      data: {
        balasan: data.balasan,
      },
    });
  }

  // (ADMIN/USER) Hapus Kritik
  static async deleteKritik(id: number) {
    return prisma.kritikSaran.delete({
      where: { id_ks: id },
    });
  }
}