import { Request, Response } from 'express';
import { BeritaService } from '../services/berita.service';
import { CreateBeritaBody, UpdateBeritaBody } from '../schemas/berita.schema';
import { PaketParams } from '../schemas/paket.schema';

export const createBeritaController = async (req: Request<{}, {}, CreateBeritaBody>, res: Response) => {
  const data = await BeritaService.createBerita(req.body);
  res.status(201).json({ message: 'Berita berhasil dibuat', data });
};

export const getAllBeritaController = async (req: Request, res: Response) => {
  const data = await BeritaService.getAllBerita();
  res.status(200).json({ message: 'Berhasil mengambil berita', data });
};

export const getBeritaByIdController = async (req: Request<PaketParams>, res: Response) => {
  const data = await BeritaService.getBeritaById(Number(req.params.id));
  res.status(200).json({ message: 'Detail berita', data });
};

export const updateBeritaController = async (req: Request<PaketParams, {}, UpdateBeritaBody>, res: Response) => {
  const data = await BeritaService.updateBerita(Number(req.params.id), req.body);
  res.status(200).json({ message: 'Berita berhasil diupdate', data });
};

export const deleteBeritaController = async (req: Request<PaketParams>, res: Response) => {
  await BeritaService.deleteBerita(Number(req.params.id));
  res.status(204).send();
};