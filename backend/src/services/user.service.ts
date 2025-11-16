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
}
