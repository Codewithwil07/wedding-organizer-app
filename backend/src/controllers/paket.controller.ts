import { Request, Response } from "express";
import { PaketService } from "../services/paket.service";
import {
  CreateDokumentasiBody,
  UpdateDokumentasiBody,
  PaketParams,
  PaginationQuery,
} from "../schemas/paket.schema";

// C = Create (Admin)
export const createDokumentasiController = async (
  req: Request<{}, {}, CreateDokumentasiBody>,
  res: Response
) => {
  const paketBaru = await PaketService.createDokumentasi(req.body);
  res.status(201).json({
    message: "Paket dokumentasi berhasil dibuat",
    data: paketBaru,
  });
};
export const getAllDokumentasiAdminController = async (
  req: Request, // <-- Tipe 'query'-nya kita hapus dulu
  res: Response
) => {
  // 1. Ambil 'cursor' & 'limit' dari query (sebagai string)
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };

  // 2. Pinterin di sini: Konversi & Kasih Default
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10; // <-- DEFAULT VALUE 10

  // 3. Bikin object 'query' yang bersih buat service
  const query = { cursor, limit };

  // 4. Lempar ke service
  const hasil = await PaketService.getAllDokumentasiAdmin(query);

  res.status(200).json({
    message: "Berhasil mengambil paket (admin)",
    ...hasil,
  });
};

// ===================================================
// GANTI CONTROLLER 'GET ALL' PUBLIC
// ===================================================
export const getAllDokumentasiPublicController = async (
  req: Request, // <-- Tipe 'query'-nya kita hapus dulu
  res: Response
) => {
  // Logic-nya SAMA PERSIS kayak admin
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };

  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10; // <-- DEFAULT VALUE 10

  const query = { cursor, limit };

  const hasil = await PaketService.getAllDokumentasiPublic(query);

  res.status(200).json({
    message: "Berhasil mengambil paket",
    ...hasil,
  });
};

// R = Read By ID (Public/Admin)
export const getDokumentasiByIdController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  const paket = await PaketService.getDokumentasiById(req.params.id); // 'id' udah jadi angka
  res.status(200).json({
    message: "Berhasil mengambil detail paket",
    data: paket,
  });
};

// U = Update (Admin)
export const updateDokumentasiController = async (
  req: Request<PaketParams, {}, UpdateDokumentasiBody>,
  res: Response
) => {
  const paketUpdate = await PaketService.updateDokumentasi(
    req.params.id,
    req.body
  );
  res.status(200).json({
    message: "Paket berhasil di-update",
    data: paketUpdate,
  });
};

// D = Delete (Admin)
export const deleteDokumentasiController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  await PaketService.deleteDokumentasi(req.params.id);
  res.status(204).send(); // 204 = No Content (sukses hapus)
};
