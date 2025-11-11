import jwt from 'jsonwebtoken';

// Pastiin JWT_SECRET ada di file .env lo
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-banget-ini-mah';

/**
 * Membuat token JWT baru
 * @param payload Data yang mau disimpen di token (id, email, role)
 */
export const signToken = (payload: { id_user: number; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d', // Token kadaluarsa dalam 1 hari
  });
};

/**
 * Memverifikasi token (dipake buat 'satpam' middleware nanti)
 */
export const verifyToken = (token: string) => {
  try {
    // Kalo token valid, balikin datanya (payload)
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Kalo token ga valid (kadaluarsa, salah secret), balikin null
    return null;
  }
};