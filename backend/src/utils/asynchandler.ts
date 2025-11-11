import { Request, Response, NextFunction } from 'express';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Membungkus controller async untuk menangkap error
 */
export const asyncHandler = (controller: Controller) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };