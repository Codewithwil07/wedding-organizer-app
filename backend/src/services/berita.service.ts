import prisma from '../lib/prisma';
import { CreateBeritaBody, UpdateBeritaBody } from '../schemas/berita.schema';

export class BeritaService {
  
  // (ADMIN) Buat Berita Baru
  static async createBerita(data: CreateBeritaBody) {
    return prisma.berita.create({
      data: {
        judul: data.judul,
        isi: data.isi,
        image_url: data.image_url,
      },
    });
  }

  // (PUBLIC/ADMIN) Ambil Semua Berita
  // Kita urutin dari yang paling baru (descending)
  static async getAllBerita() {
    return prisma.berita.findMany({
      orderBy: { tanggal: 'desc' },
    });
  }

  // (PUBLIC/ADMIN) Ambil Detail Berita
  static async getBeritaById(id: number) {
    return prisma.berita.findUniqueOrThrow({
      where: { id_berita: id },
    });
  }

  // (ADMIN) Update Berita
  static async updateBerita(id: number, data: UpdateBeritaBody) {
    return prisma.berita.update({
      where: { id_berita: id },
      data: data,
    });
  }

  // (ADMIN) Hapus Berita
  static async deleteBerita(id: number) {
    return prisma.berita.delete({
      where: { id_berita: id },
    });
  }
}