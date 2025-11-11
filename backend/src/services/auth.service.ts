import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/hash.utils';
import { signToken } from '../utils/jwt.utils';
import { RegisterBody, LoginBody } from '../schemas/auth.schema';

export class AuthService {
  /**
   * Logika untuk mendaftarkan user baru
   */
  static async register(data: RegisterBody) {
    const { email, username, password } = data;

    // 1. Hash passwordnya
    const hashedPassword = hashPassword(password);

    // 2. Simpen ke DB pake Prisma
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'pemesan', // Sesuai skema kita, default 'pemesan'
      },
      // 3. Pilih data apa aja yg mau dibalikin (JANGAN BALIKIN PASSWORD)
      select: {
        id_user: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return newUser;
  }

  /**
   * Logika untuk login user
   */
  static async login(data: LoginBody) {
    const { email, password } = data;

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Kalo user ga ada, lempar error
    // Error ini bakal ditangkep sama Global Error Handler
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // 3. Bandingin password input sama yg di DB
    const isPasswordValid = comparePassword(password, user.password);

    // 4. Kalo password salah, lempar error
    if (!isPasswordValid) {
      throw new Error('Password salah');
    }

    // 5. Kalo bener, bikin token
    const tokenPayload = {
      id_user: user.id_user,
      email: user.email,
      role: String(user.role), // konversi enum ke string
    };
    const token = signToken(tokenPayload);

    // 6. Balikin data yg aman (tanpa password) + token
    return {
      user: {
        id_user: user.id_user,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}