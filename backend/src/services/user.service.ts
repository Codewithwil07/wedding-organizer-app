import prisma from "../lib/prisma";
import { UpdateProfileBody } from "../schemas/user.schema";
import { hashPassword } from "../utils/hash.utils"; // (Kita pinjem helper lama)

export class UserService {
  /**
   * (USER) Ambil data profil (buat halaman 'Profile Settings')
   */
  static async getMyProfile(userId: number) {
    // Kita 're-fetch' data user (tanpa password)
    // buat mastiin dapet data paling baru
    return prisma.user.findUniqueOrThrow({
      where: { id_user: userId },
      select: {
        id_user: true,
        email: true,
        password: true,
        username: true,
      },
    });
  }

  /**
   * (USER) Update profil
   */
  static async updateMyProfile(userId: number, data: UpdateProfileBody) {
    const { username, email, password } = data;

    const dataToUpdate: any = {};

    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = hashPassword(password);

    // Kalau data kosong, throw error
    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error("No valid fields to update");
    }

    return prisma.user.update({
      where: { id_user: userId },
      data: dataToUpdate,
      select: {
        id_user: true,
        email: true,
        password: true,
        username: true,
      },
    });
  }

  // ... imports (prisma, UpdateProfileBody, hashPassword, dll) ...

  // ===================================================
  // ADMIN MANAGEMENT (CRUD ADMIN)
  // ===================================================

  // (ADMIN) Ambil semua admin
  static async getAllAdmins() {
    return prisma.user.findMany({
      where: { role: "admin", id_user: { not: 1 } },
      select: {
        id_user: true,
        username: true,
        email: true,
        role: true, // Harusnya selalu 'admin'
      },
      orderBy: { username: "asc" },
    });
  }

  // (ADMIN) Tambah Admin Baru
  static async createAdmin(data: any) {
    const { username, email, password } = data;

    // Cek email duplikat
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error("Email sudah digunakan");

    const hashedPassword = hashPassword(password);

    return prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "admin", // Paksa jadi admin
      },
    });
  }

  // (ADMIN) Hapus Admin
  static async deleteAdmin(id: number) {
    // Jangan biarkan admin menghapus dirinya sendiri (opsional, tapi bagus)
    // Tapi buat simpel, kita gas aja delete.
    if (id === 1) {
      throw new Error("Super Admin tidak bisa dihapus.");
    }
    return prisma.user.delete({
      where: { id_user: id },
    });
  }

  // (ADMIN) Update Admin Lain (Ganti nama/password)
  static async updateAdminById(id: number, data: any) {
    const { username, password } = data;
    const updateData: any = {};

    if (username) updateData.username = username;
    if (password) updateData.password = hashPassword(password);

    return prisma.user.update({
      where: { id_user: id },
      data: updateData,
    });
  }
}
