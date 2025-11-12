import { Request, Response } from "express";
import { PesananService } from "../services/pesanan.service";
import { CreatePesananBody, UpdateStatusBody } from "../schemas/pesanan.schema";
import { PaketParams, PaginationQuery } from "../schemas/paket.schema";
import { User } from "@prisma/client"; // Import User

// === (USER) Create Pesanan ===
export const createPesananController = async (
  req: Request<{}, {}, CreatePesananBody>,
  res: Response
) => {
  // Kita butuh ID user dari token (yg udah ditempel 'protect' middleware)
  const user = req.user as User;

  const pesananBaru = await PesananService.createPesanan(
    req.body,
    user.id_user
  );

  res.status(201).json({
    message: "Booking berhasil dibuat dan sedang menunggu konfirmasi",
    data: pesananBaru,
  });
};

// === (USER) Get Pesanan Saya ===
export const getMyPesananController = async (req: Request, res: Response) => {
  const user = req.user as User;

  const pesanan = await PesananService.getPesananByUserId(user.id_user);

  res.status(200).json({
    message: "Berhasil mengambil history pesanan",
    data: pesanan,
  });
};

// === (USER) Cancel Pesanan ===
export const cancelPesananController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  const user = req.user as User;
  const { id } = req.params; // ID Pesanan

  await PesananService.cancelPesanan(id, user.id_user);

  res.status(204).send(); // Sukses batal
};

// === (ADMIN) Get All Pesanan ===
// === (ADMIN) Get All Pesanan ===
export const getAllPesananAdminController = async (
  req: Request, // <-- Hapus tipe 'PaginationQuery'
  res: Response
) => {
  // 1. Ambil 'cursor' & 'limit' dari query (sebagai string)
  const { cursor: cursorString, limit: limitString } = req.query as { cursor?: string, limit?: string };

  // 2. Pinterin di sini: Konversi & Kasih Default
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10; // <-- DEFAULT VALUE 10

  // 3. Bikin object 'query' yang bersih buat service
  const query = { cursor, limit };
  
  // 4. Lempar ke service
  const hasil = await PesananService.getAllPesananAdmin(query);
  
  res.status(200).json({
    message: 'Berhasil mengambil semua pesanan',
    ...hasil,
  });
};

// === (ADMIN) Update Status Pesanan ===
export const updateStatusPesananController = async (
  req: Request<PaketParams, {}, UpdateStatusBody>,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  const pesananUpdate = await PesananService.updatePesananStatus(id, status);

  res.status(200).json({
    message: `Pesanan berhasil di-${status.toLowerCase()}`,
    data: pesananUpdate,
  });
};
