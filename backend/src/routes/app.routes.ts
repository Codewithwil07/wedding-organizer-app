import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler";
import { validate } from "../middlewares/validate.middleware";
import {
  paginationQuerySchema,
  paketParamsSchema,
} from "../schemas/paket.schema";
import {
  // Dokumentasi
  getAllDokumentasiPublicController,
  getDokumentasiByIdController,
  // Busana
  getAllBusanaPublicController,
  getBusanaByIdController,
  // Dekorasi
  getAllDekorasiPublicController,
  getDekorasiByIdController,
  // Akad Resepsi
  getAllAkadResepsiPublicController,
  getAkadResepsiByIdController,
  getHomeDataController,
} from "../controllers/paket.controller";
import { protect } from "../middlewares/auth.middleware";
import { createPesananSchema } from "../schemas/pesanan.schema";
import {
  cancelPesananController,
  createPesananController,
  getMyPesananByIdController,
  getMyPesananController,
} from "../controllers/pesanan.controller";
import {
  getMyProfileController,
  updateMyProfileController,
} from "../controllers/user.controller";

const router = Router();

// ===================================================
// RUTE DOKUMENTASI (Publik)
// ===================================================
// (R)EAD ALL: GET /api/app/paket/dokumentasi
router.get(
  "/paket/dokumentasi",
  validate(paginationQuerySchema), // Validasi ?cursor= & ?limit=
  asyncHandler(getAllDokumentasiPublicController)
);

// (R)EAD BY ID: GET /api/app/paket/dokumentasi/:id
router.get(
  "/paket/dokumentasi/:id",
  validate(paketParamsSchema), // Validasi :id
  asyncHandler(getDokumentasiByIdController)
);

// ===================================================
// RUTE BUSANA (Publik) [cite: 630-632]
// ===================================================
// (R)EAD ALL: GET /api/app/paket/busana
router.get(
  "/paket/busana",
  validate(paginationQuerySchema),
  asyncHandler(getAllBusanaPublicController)
);

// (R)EAD BY ID: GET /api/app/paket/busana/:id
router.get(
  "/paket/busana/:id",
  validate(paketParamsSchema),
  asyncHandler(getBusanaByIdController)
);

// ===================================================
// RUTE DEKORASI (Publik) [cite: 643-647]
// ===================================================
// (R)EAD ALL: GET /api/app/paket/dekorasi
router.get(
  "/paket/dekorasi",
  validate(paginationQuerySchema),
  asyncHandler(getAllDekorasiPublicController)
);

// (R)EAD BY ID: GET /api/app/paket/dekorasi/:id
router.get(
  "/paket/dekorasi/:id",
  validate(paketParamsSchema),
  asyncHandler(getDekorasiByIdController)
);

// ===================================================
// RUTE AKAD & RESEPSI (Publik) [cite: 648-650]
// ===================================================
// (R)EAD ALL: GET /api/app/paket/akadresepsi
router.get(
  "/paket/akadresepsi",
  validate(paginationQuerySchema),
  asyncHandler(getAllAkadResepsiPublicController)
);

// (R)EAD BY ID: GET /api/app/paket/akadresepsi/:id
router.get(
  "/paket/akadresepsi/:id",
  validate(paketParamsSchema),
  asyncHandler(getAkadResepsiByIdController)
);

// (C)REATE: POST /api/app/pesanan
router.post(
  "/pesanan",
  protect, // <-- WAJIB LOGIN
  validate(createPesananSchema),
  asyncHandler(createPesananController)
);

// (R)EAD MY: GET /api/app/pesanan/saya
router.get(
  "/pesanan/saya",
  protect, // <-- WAJIB LOGIN
  asyncHandler(getMyPesananController)
);

// / 3. Liat Detail Pesanan (INI YANG TADINYA HILANG!)
router.get(
  "/pesanan/:id", // <-- Endpoint GET by ID
  protect,
  validate(paketParamsSchema), // Validasi ID angka
  asyncHandler(getMyPesananByIdController)
);

// (D)PUT: PUT /api/app/pesanan/:id
router.put(
  "/pesanan/:id",
  protect, // <-- WAJIB LOGIN
  validate(paketParamsSchema),
  asyncHandler(cancelPesananController)
);

// (R)EAD MY: GET /api/app/profil
router.get(
  "/profil",
  protect, // <-- WAJIB LOGIN
  asyncHandler(getMyProfileController)
);

// (P)EAD MY: PUT /api/app/profil/:id
router.put(
  "/profil",
  protect, // <-- WAJIB LOGIN
  asyncHandler(updateMyProfileController)
);

router.get("/home", asyncHandler(getHomeDataController));

// ... imports yang lain ...
import {
  getAllBeritaController,
  getBeritaByIdController,
} from "../controllers/berita.controller";

// ... rute paket yang udah ada ...

// ===================================================
// RUTE BERITA (PUBLIC - APP)
// ===================================================
router.get("/berita", asyncHandler(getAllBeritaController));
router.get(
  "/berita/:id",
  validate(paketParamsSchema),
  asyncHandler(getBeritaByIdController)
);

// ... imports
import { createKritikSchema } from "../schemas/kritik.schema";
import {
  createKritikController,
  getMyKritikController,
} from "../controllers/kritik.controller";

// ... (rute pesanan) ...

// ===================================================
// RUTE KRITIK & SARAN (USER)
// ===================================================
router.post(
  "/kritik",
  protect,
  validate(createKritikSchema),
  asyncHandler(createKritikController)
);
router.get("/kritik/saya", protect, asyncHandler(getMyKritikController));

export default router;
