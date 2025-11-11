import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadSingleImage } from "../controllers/upload.controller";
import { protect, isAdmin } from "../middlewares/auth.middleware"; // (Opsional: amankan upload)

const router = Router();

// --- Konfigurasi Multer ---
const storage = multer.diskStorage({
  // Tentukan folder penyimpanan
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // (Pastikan lo UDAH BIKIN folder 'uploads/' di root backend)
  },
  // Bikin nama file unik biar ga tabrakan
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
// --------------------------

/**
 * Endpoint: POST /api/upload/single
 * Cuma buat admin, dan cuma nanganin 1 file yg namanya 'image'
 */
router.post(
  "/single",
  protect, // (Satpam Level 1: Cek login)
  isAdmin, // (Satpam Level 2: Cek admin)
  upload.single("image"), // (Multer: Nangkep 1 file dari field 'image')
  uploadSingleImage
);

export default router;
