import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

// 'Tipe' ini bakal kita tempel ke 'Request' Express
export interface AuthRequest extends Request {
  user?: User; // Bikin `req.user` jadi opsional
}

/**
 * Middleware untuk mengecek apakah user sudah login (punya token valid).
 * Ini 'satpam' level 1.
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;

  // 1. Cek apakah ada header 'Authorization' dan formatnya 'Bearer <token>'
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, tidak ada token" });
  }

  // 2. Verifikasi token
  const payload = verifyToken(token) as {
    id_user: number;
    email: string;
    role: string;
  };

  if (!payload) {
    return res
      .status(401)
      .json({ message: "Akses ditolak, token tidak valid" });
  }

  // 3. Cari user di DB berdasarkan ID dari token
  const user = await prisma.user.findUnique({
    where: { id_user: payload.id_user },
    // Pastiin JANGAN ambil password
    select: {
      id_user: true,
      email: true,
      role: true,
      username: true,
      pesanan: false, // Kita ga butuh ini di req.user
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User tidak ditemukan" });
  }

  // 4. Sukses! Tempel data 'user' ke object 'req'
  req.user = user as User;
  next(); // Lanjut ke controller
};

/**
 * Middleware untuk mengecek apakah user adalah ADMIN.
 * Ini 'satpam' level 2 (harus lolos 'protect' dulu).
 */
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "admin") {
    next(); // Lanjut, dia admin
  } else {
    return res.status(403).json({ message: "Akses ditolak, Anda bukan admin" });
  }
};
