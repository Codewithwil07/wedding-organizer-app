import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asynchandler"; 
import { validate } from "../middlewares/validate.middleware"; 
import { registerSchema, loginSchema } from "../schemas/auth.schema"; 

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

export default router;
