import express, { Express, Request, Response, NextFunction } from "express"; // <-- TAMBAHIN NextFunction
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from "./routes";
import uploadRouter from "./routes/upload.routes";

// Inisialisasi dotenv
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router Utama
app.use("/api", mainRouter);
app.use('/api/upload', uploadRouter);

// ===================================================
//  GLOBAL ERROR HANDLER (PENANGKAP)
//  Ini WAJIB ditaro SETELAH 'app.use('/api', mainRouter)'
// ===================================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error-nya ke konsol biar lo tau
  console.error("---------------------------------");
  console.error(`[GLOBAL ERROR]: ${err.message}`);
  console.error(err.stack);
  console.error("---------------------------------");

  // Handle error dari Prisma (P2002 = Unique constraint failed)
  if (
    err.name === "PrismaClientKnownRequestError" &&
    (err as any).code === "P2002"
  ) {
    const target = (err as any).meta?.target || "Data";
    return res.status(409).json({
      message: `${target} sudah terdaftar, silakan gunakan ${target} lain.`,
    });
  }
  

  // Handle error custom dari service (misal 'Password salah')
  if (
    err.message === "User tidak ditemukan" ||
    err.message === "Password salah"
  ) {
    return res
      .status(401)
      .json({ message: "Email atau password yang Anda masukkan salah." });
  }

  // Fallback error 500 (kalo errornya ga dikenal)
  res.status(500).json({
    message: err.message || "Terjadi kesalahan pada server, coba lagi nanti.",
  });
});

// Jalanin Server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server CWO siap di http://localhost:${PORT}`);
});
