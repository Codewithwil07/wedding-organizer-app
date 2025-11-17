import prisma from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/hash.utils";
import { signToken } from "../utils/jwt.utils";
import { RegisterBody, LoginBody } from "../schemas/auth.schema";
import { sendEmail } from "../utils/mailer"; // <-- IMPORT TUKANG POS
import { ForgotPasswordBody, ResetPasswordBody } from "../schemas/auth.schema"; // <-- IMPORT TIPE BARU

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
        role: "pemesan", // Sesuai skema kita, default 'pemesan'
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
      throw new Error("User tidak ditemukan");
    }

    // 3. Bandingin password input sama yg di DB
    const isPasswordValid = comparePassword(password, user.password);

    // 4. Kalo password salah, lempar error
    if (!isPasswordValid) {
      throw new Error("Password salah");
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
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async forgotPassword(data: ForgotPasswordBody) {
    const { email } = data;

    // 1. Cari user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // (Kita gak bilang "user ga ada" biar aman,
      // tapi buat 'joki sprint' kita lempar error aja)
      throw new Error("USER_NOT_FOUND");
    }

    // 2. Bikin OTP 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Bikin waktu kadaluarsa (10 menit dari sekarang)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // 3. Simpen OTP & expiry ke DB
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: otp,
        passwordResetExpires: expires,
      },
    });

    // 4. Kirim email (pake 'tukang pos' kita)
    const message = `Kode OTP Anda untuk reset password CWO adalah: ${otp}. \n\nKode ini hanya valid selama 10 menit.`;
    await sendEmail(user.email, "Reset Password CWO", message);

    return { message: "OTP berhasil dikirim ke email Anda." };
  }

  // ===================================================
  // FUNGSI BARU: RESET PASSWORD [cite: 689, 691]
  // ===================================================
  static async resetPassword(data: ResetPasswordBody) {
    const { email, token, password } = data;

    // 1. Cari user pake 3 KUNCI: email, token, dan BELUM KADALUARSA
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(), // 'gt' = greater than (lebih besar dari) sekarang
        },
      },
    });

    // 2. Kalo ga nemu (token salah / kadaluarsa)
    if (!user) {
      throw new Error("TOKEN_INVALID_OR_EXPIRED");
    }

    // 3. Kalo token bener, hash password baru
    const hashedPassword = hashPassword(password);

    // 4. Update password & HAPUS token-nya
    await prisma.user.update({
      where: { id_user: user.id_user },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // <-- Hapus token (biar ga dipake lagi)
        passwordResetExpires: null,
      },
    });

    return { message: "Password berhasil di-reset. Silakan login." };
  }
}
