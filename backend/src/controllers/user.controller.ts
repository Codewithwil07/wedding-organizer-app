import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UpdateProfileBody } from '../schemas/user.schema';
import { User } from '@prisma/client';

// === (USER) Get My Profile ===
// Ini controller buat 'GET /api/app/profil'
export const getMyProfileController = async (req: Request, res: Response) => {
  const user = req.user as User;
  
  // 'req.user' udah punya data user, tapi kita fetch ulang
  // biar dapet data TERBARU (best practice)
  const profile = await UserService.getMyProfile(user.id_user);
  
  res.status(200).json({
    message: 'Berhasil mengambil profil',
    data: profile,
  });
};

// === (USER) Update My Profile ===
// Ini controller buat 'PUT /api/app/profil'
export const updateMyProfileController = async (
  req: Request<{}, {}, UpdateProfileBody>, 
  res: Response
) => {
  const user = req.user as User;
  const data = req.body;
  
  const updatedUser = await UserService.updateMyProfile(user.id_user, data);

  res.status(200).json({
    message: 'Profil berhasil di-update',
    data: updatedUser,
  });
};