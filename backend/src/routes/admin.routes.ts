import { Router } from "express";
// ... (imports lama lo) ...

// 1. IMPORT SKEMA BARU
import {
  createBusanaSchema,
  updateBusanaSchema,
  createDekorasiSchema,
  updateDekorasiSchema,
  createAkadResepsiSchema,
  updateAkadResepsiSchema,
  paginationQuerySchema,
  paketParamsSchema,
  createDokumentasiSchema,
  updateDokumentasiSchema,
} from "../schemas/paket.schema";

// 2. IMPORT CONTROLLER BARU
import {
  createBusanaController,
  getAllBusanaAdminController,
  getBusanaByIdController,
  updateBusanaController,
  deleteBusanaController,
  createDekorasiController,
  getAllDekorasiAdminController,
  getDekorasiByIdController,
  updateDekorasiController,
  deleteDekorasiController,
  createAkadResepsiController,
  getAllAkadResepsiAdminController,
  getAkadResepsiByIdController,
  updateAkadResepsiController,
  deleteAkadResepsiController,
  createDokumentasiController,
  getAllDokumentasiAdminController,
  getDokumentasiByIdController,
  updateDokumentasiController,
  deleteDokumentasiController,
} from "../controllers/paket.controller";
import { isAdmin, protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asynchandler";
import {
  getAllPesananAdminController,
  updateStatusPesananController,
} from "../controllers/pesanan.controller";
import { updateStatusSchema } from "../schemas/pesanan.schema";

const router = Router();
router.use(protect);
router.use(isAdmin);

// (C)REATE: POST /api/admin/paket/dokumentasi
router.post(
  "/paket/dokumentasi",
  validate(createDokumentasiSchema),
  asyncHandler(createDokumentasiController)
);

// (R)EAD ALL: GET /api/admin/paket/dokumentasi
router.get(
  "/paket/dokumentasi",
  validate(paginationQuerySchema),
  asyncHandler(getAllDokumentasiAdminController)
);

// (R)EAD BY ID: GET /api/admin/paket/dokumentasi/:id
router.get(
  "/paket/dokumentasi/:id",
  validate(paketParamsSchema),
  asyncHandler(getDokumentasiByIdController)
);

// (U)PDATE: PUT /api/admin/paket/dokumentasi/:id
router.put(
  "/paket/dokumentasi/:id",
  validate(updateDokumentasiSchema),
  asyncHandler(updateDokumentasiController)
);

// (D)ELETE: DELETE /api/admin/paket/dokumentasi/:id
router.delete(
  "/paket/dokumentasi/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteDokumentasiController)
);

// ===================================================
// TAMBAHKAN RUTE 'BUSANA'
// ===================================================
router.post(
  "/paket/busana",
  validate(createBusanaSchema),
  asyncHandler(createBusanaController)
);
router.get(
  "/paket/busana",
  validate(paginationQuerySchema),
  asyncHandler(getAllBusanaAdminController)
);
router.get(
  "/paket/busana/:id",
  validate(paketParamsSchema),
  asyncHandler(getBusanaByIdController)
);
router.put(
  "/paket/busana/:id",
  validate(updateBusanaSchema),
  asyncHandler(updateBusanaController)
);
router.delete(
  "/paket/busana/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteBusanaController)
);

// ===================================================
// TAMBAHKAN RUTE 'DEKORASI'
// ===================================================
router.post(
  "/paket/dekorasi",
  validate(createDekorasiSchema),
  asyncHandler(createDekorasiController)
);
router.get(
  "/paket/dekorasi",
  validate(paginationQuerySchema),
  asyncHandler(getAllDekorasiAdminController)
);
router.get(
  "/paket/dekorasi/:id",
  validate(paketParamsSchema),
  asyncHandler(getDekorasiByIdController)
);
router.put(
  "/paket/dekorasi/:id",
  validate(updateDekorasiSchema),
  asyncHandler(updateDekorasiController)
);
router.delete(
  "/paket/dekorasi/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteDekorasiController)
);

// ===================================================
// TAMBAHKAN RUTE 'AKAD & RESEPSI'
// ===================================================
router.post(
  "/paket/akadresepsi",
  validate(createAkadResepsiSchema),
  asyncHandler(createAkadResepsiController)
);
router.get(
  "/paket/akadresepsi",
  validate(paginationQuerySchema),
  asyncHandler(getAllAkadResepsiAdminController)
);
router.get(
  "/paket/akadresepsi/:id",
  validate(paketParamsSchema),
  asyncHandler(getAkadResepsiByIdController)
);
router.put(
  "/paket/akadresepsi/:id",
  validate(updateAkadResepsiSchema),
  asyncHandler(updateAkadResepsiController)
);
router.delete(
  "/paket/akadresepsi/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteAkadResepsiController)
);

// PESANAN
router.get(
  "/pesanan",
  validate(paginationQuerySchema),
  asyncHandler(getAllPesananAdminController)
);

// (U)PDATE STATUS: PUT /api/admin/pesanan/:id/status
router.put(
  "/pesanan/:id/status",
  validate(updateStatusSchema),
  asyncHandler(updateStatusPesananController)
);

// ... imports yang lain ...
import {
  createBeritaSchema,
  updateBeritaSchema,
} from "../schemas/berita.schema";
import {
  createBeritaController,
  getAllBeritaController,
  getBeritaByIdController,
  updateBeritaController,
  deleteBeritaController,
} from "../controllers/berita.controller";

// ... rute-rute paket & pesanan yang udah ada ...

// ===================================================
// RUTE BERITA (ADMIN)
// ===================================================
router.post(
  "/berita",
  validate(createBeritaSchema),
  asyncHandler(createBeritaController)
);
router.get("/berita", asyncHandler(getAllBeritaController)); // Admin juga perlu liat list
router.get(
  "/berita/:id",
  validate(paketParamsSchema),
  asyncHandler(getBeritaByIdController)
);
router.put(
  "/berita/:id",
  validate(updateBeritaSchema),
  asyncHandler(updateBeritaController)
);
router.delete(
  "/berita/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteBeritaController)
);

// ... imports
import { replyKritikSchema } from "../schemas/kritik.schema";
import {
  getAllKritikController,
  replyKritikController,
  deleteKritikController,
} from "../controllers/kritik.controller";

// ... (rute berita) ...

// ===================================================
// RUTE KRITIK & SARAN (ADMIN)
// ===================================================
router.get("/kritik", asyncHandler(getAllKritikController));
router.put(
  "/kritik/:id/reply",
  validate(replyKritikSchema),
  asyncHandler(replyKritikController)
);
router.delete(
  "/kritik/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteKritikController)
);

// ... imports ...
// Kita pinjem skema register/update profile buat validasi biar cepet
import { registerSchema } from "../schemas/auth.schema";
import { updateProfileSchema } from "../schemas/user.schema";
import {
  getAllAdminsController,
  createAdminController,
  updateAdminByIdController,
  deleteAdminController,
} from "../controllers/user.controller";

// ... rute lain ...

// ===================================================
// RUTE MANAJEMEN ADMIN
// ===================================================
router.get("/users", asyncHandler(getAllAdminsController));
router.post(
  "/users",
  validate(registerSchema),
  asyncHandler(createAdminController)
); // Pake skema register
router.put(
  "/users/:id",
  validate(updateProfileSchema),
  asyncHandler(updateAdminByIdController)
); // Pake skema update profil
router.delete(
  "/users/:id",
  validate(paketParamsSchema),
  asyncHandler(deleteAdminController)
);


export default router;
