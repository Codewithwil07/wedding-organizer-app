import { Request, Response } from 'express';
import { KritikService } from '../services/kritik.service';
import { CreateKritikBody, ReplyKritikBody } from '../schemas/kritik.schema';
import { User } from '@prisma/client';
import { PaketParams } from '../schemas/paket.schema';

// USER
export const createKritikController = async (req: Request<{}, {}, CreateKritikBody>, res: Response) => {
  const user = req.user as User;
  const data = await KritikService.createKritik(user.id_user, req.body);
  res.status(201).json({ message: 'Kritik & Saran terkirim', data });
};

export const getMyKritikController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const data = await KritikService.getMyKritik(user.id_user);
  res.status(200).json({ message: 'History kritik saya', data });
};

// ADMIN
export const getAllKritikController = async (req: Request, res: Response) => {
  const data = await KritikService.getAllKritik();
  res.status(200).json({ message: 'Semua kritik saran', data });
};

export const replyKritikController = async (req: Request<PaketParams, {}, ReplyKritikBody>, res: Response) => {
  const data = await KritikService.replyKritik(Number(req.params.id), req.body);
  res.status(200).json({ message: 'Balasan terkirim', data });
};

export const deleteKritikController = async (req: Request<PaketParams>, res: Response) => {
  await KritikService.deleteKritik(Number(req.params.id));
  res.status(204).send();
};