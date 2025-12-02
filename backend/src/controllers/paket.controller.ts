import { Request, Response } from "express";
import { PaketService } from "../services/paket.service";
import {
  CreateDokumentasiBody,
  UpdateDokumentasiBody,
  PaketParams,
  PaginationQuery,
} from "../schemas/paket.schema";

import {
  CreateBusanaBody,
  UpdateBusanaBody,
  CreateDekorasiBody,
  UpdateDekorasiBody,
  CreateAkadResepsiBody,
  UpdateAkadResepsiBody,
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
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };

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

// ===================================================
// CONTROLLER BUSANA
// ===================================================
export const createBusanaController = async (
  req: Request<{}, {}, CreateBusanaBody>,
  res: Response
) => {
  const data = await PaketService.createBusana(req.body);
  res.status(201).json({ message: "Paket busana berhasil dibuat", data });
};

export const getAllBusanaAdminController = async (
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10;
  const query = { cursor, limit };

  const hasil = await PaketService.getAllBusanaAdmin(query);
  res
    .status(200)
    .json({ message: "Berhasil mengambil paket (admin)", ...hasil });
};

export const getAllBusanaPublicController = async (
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10;
  const query = { cursor, limit };

  const hasil = await PaketService.getAllBusanaPublic(query);
  res.status(200).json({ message: "Berhasil mengambil paket", ...hasil });
};

export const getBusanaByIdController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  const data = await PaketService.getBusanaById(req.params.id);
  res.status(200).json({ message: "Berhasil mengambil detail paket", data });
};

export const updateBusanaController = async (
  req: Request<PaketParams, {}, UpdateBusanaBody>,
  res: Response
) => {
  const data = await PaketService.updateBusana(req.params.id, req.body);
  res.status(200).json({ message: "Paket berhasil di-update", data });
};

export const deleteBusanaController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  await PaketService.deleteBusana(req.params.id);
  res.status(204).send();
};

// ===================================================
// CONTROLLER DEKORASI
// ===================================================
export const createDekorasiController = async (
  req: Request<{}, {}, CreateDekorasiBody>,
  res: Response
) => {
  const data = await PaketService.createDekorasi(req.body);
  res.status(201).json({ message: "Paket dekorasi berhasil dibuat", data });
};

export const getAllDekorasiAdminController = async (
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10;
  const query = { cursor, limit };

  const hasil = await PaketService.getAllDekorasiAdmin(query);
  res
    .status(200)
    .json({ message: "Berhasil mengambil paket (admin)", ...hasil });
};

export const getAllDekorasiPublicController = async (
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10;
  const query = { cursor, limit };

  const hasil = await PaketService.getAllDekorasiPublic(query);
  res.status(200).json({ message: "Berhasil mengambil paket", ...hasil });
};

export const getDekorasiByIdController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  const data = await PaketService.getDekorasiById(req.params.id);
  res.status(200).json({ message: "Berhasil mengambil detail paket", data });
};

export const updateDekorasiController = async (
  req: Request<PaketParams, {}, UpdateDekorasiBody>,
  res: Response
) => {
  const data = await PaketService.updateDekorasi(req.params.id, req.body);
  res.status(200).json({ message: "Paket berhasil di-update", data });
};

export const deleteDekorasiController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  await PaketService.deleteDekorasi(req.params.id);
  res.status(204).send();
};

// ===================================================
// CONTROLLER AKAD & RESEPSI
// ===================================================
export const createAkadResepsiController = async (
  req: Request<{}, {}, CreateAkadResepsiBody>,
  res: Response
) => {
  const data = await PaketService.createAkadResepsi(req.body);
  res.status(201).json({ message: "Paket akad-resepsi berhasil dibuat", data });
};

export const getAllAkadResepsiAdminController = async (
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10;
  const query = { cursor, limit };

  const hasil = await PaketService.getAllAkadResepsiAdmin(query);
  res
    .status(200)
    .json({ message: "Berhasil mengambil paket (admin)", ...hasil });
};

export const getAllAkadResepsiPublicController = async (
  req: Request,
  res: Response
) => {
  const { cursor: cursorString, limit: limitString } = req.query as {
    cursor?: string;
    limit?: string;
  };
  const cursor = cursorString ? Number(cursorString) : undefined;
  const limit = limitString ? Number(limitString) : 10;
  const query = { cursor, limit };

  const hasil = await PaketService.getAllAkadResepsiPublic(query);
  res.status(200).json({ message: "Berhasil mengambil paket", ...hasil });
};

export const getAkadResepsiByIdController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  const data = await PaketService.getAkadResepsiById(req.params.id);
  res.status(200).json({ message: "Berhasil mengambil detail paket", data });
};

export const updateAkadResepsiController = async (
  req: Request<PaketParams, {}, UpdateAkadResepsiBody>,
  res: Response
) => {
  const data = await PaketService.updateAkadResepsi(req.params.id, req.body);
  res.status(200).json({ message: "Paket berhasil di-update", data });
};

export const deleteAkadResepsiController = async (
  req: Request<PaketParams>,
  res: Response
) => {
  await PaketService.deleteAkadResepsi(req.params.id);
  res.status(204).send();
};

// ... imports ...

// === HOME DASHBOARD DATA ===
// === HOME DASHBOARD DATA ===
export const getHomeDataController = async (req: Request, res: Response) => {
  // Ambil query 'q' dari URL (cth: /home?q=makeup)
  const query = (req.query.q as string) || "";

  const data = await PaketService.getHomeData(query);

  res.status(200).json({
    message: "Berhasil mengambil data home",
    data: data,
  });
};
