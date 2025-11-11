import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asynchandler";
import { protect, isAdmin } from "../middlewares/auth.middleware";
import {
  createDokumentasiSchema,
  updateDokumentasiSchema,
  paketParamsSchema,
  paginationQuerySchema,
} from "../schemas/paket.schema";
import {
  createDokumentasiController,
  getAllDokumentasiAdminController,
  updateDokumentasiController,
  deleteDokumentasiController,
  getDokumentasiByIdController, 
} from "../controllers/paket.controller";

const router = Router();

// Pasang 'satpam' di semua rute /api/admin/*
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
  asyncHandler(getDokumentasiByIdController) // (Pake controller yg sama dgn public)
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

export default router;
