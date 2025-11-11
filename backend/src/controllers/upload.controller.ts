import { Request, Response } from "express";

export const uploadSingleImage = (req: Request, res: Response) => {
  // 1. Cek filenya
  if (!req.file) {
    return res.status(400).json({ message: "Tidak ada file yang di-upload" });
  }

  // 2. 'req.file.filename' itu nama file aman yg dibikin 'multer'
  // Kita balikin URL publiknya
  const fileUrl = `/uploads/${req.file.filename}`;

  // 3. Balikin URL-nya ke frontend
  res.status(201).json({
    message: "File berhasil di-upload",
    url: fileUrl,
  });
};
