import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asynchandler"; 
import { validate } from "../middlewares/validate.middleware"; 
import { registerSchema, loginSchema } from "../schemas/auth.schema"; 
import { forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth.schema";
import { forgotPasswordController, resetPasswordController } from "../controllers/auth.controller";

const router = Router();

/**
 * Endpoint: POST /api/auth/register
 * Alur:
 * 1. Validasi pake 'registerSchema'
 * 2. Bungkus controller pake 'asyncHandler'
 */
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(registerController)
);

/**
 * Endpoint: POST /api/auth/login
 * Alur:
 * 1. Validasi pake 'loginSchema'
 * 2. Bungkus controller pake 'asyncHandler'
 */
router.post("/login", validate(loginSchema), asyncHandler(loginController));

router.post(
  '/forgot-password', 
  validate(forgotPasswordSchema), 
  asyncHandler(forgotPasswordController)
);

// ===================================================
// RUTE BARU: RESET PASSWORD
// ===================================================
// Endpoint: POST /api/auth/reset-password
router.post(
  '/reset-password', 
  validate(resetPasswordSchema), 
  asyncHandler(resetPasswordController)
);

export default router;
