import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler";
import { validate } from "../middlewares/validate.middleware";
import {
  paginationQuerySchema,
  paketParamsSchema,
} from "../schemas/paket.schema";
import {
  getAllDokumentasiPublicController,
  getDokumentasiByIdController,
} from "../controllers/paket.controller";

const router = Router();

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

export default router;
