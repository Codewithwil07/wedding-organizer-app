import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterBody, LoginBody } from "../schemas/auth.schema";
import { ForgotPasswordBody, ResetPasswordBody } from "../schemas/auth.schema";


export const registerController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const newUser = await AuthService.register(req.body);

  res.status(201).json({
    message: "User berhasil dibuat",
    data: newUser,
  });
};

/**
 * Controller untuk Login.
 */
export const loginController = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  // Data di req.body UDAH PASTI VALID
  const loginData = await AuthService.login(req.body);

  res.status(200).json({
    message: "Login berhasil",
    data: loginData,
  });
};



// ===================================================
// CONTROLLER BARU: LUPA PASSWORD
// ===================================================
export const forgotPasswordController = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response
) => {
  const result = await AuthService.forgotPassword(req.body);
  res.status(200).json(result);
};

// ===================================================
// CONTROLLER BARU: RESET PASSWORD
// ===================================================
export const resetPasswordController = async (
  req: Request<{}, {}, ResetPasswordBody>,
  res: Response
) => {
  const result = await AuthService.resetPassword(req.body);
  res.status(200).json(result);
};
