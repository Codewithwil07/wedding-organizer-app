import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

/**
 * Middleware untuk memvalidasi request (body, query, params)
 * menggunakan skema Zod yang diberikan.
 */
export const validate = (schema: ZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validasi skema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Kalo lolos, lanjut ke controller
      return next();
    } catch (error) {
      // Kalo gagal, kirim respon error 400
      if (error instanceof ZodError) {
        // Format error Zod biar rapih
        const errors = error.issues.map(err => ({
          field: err.path.length > 1 ? err.path[1] : err.path[0],
          message: err.message,
        }));
        return res.status(400).json({
          message: 'Validasi data gagal',
          errors,
        });
      }
      // Error lain
      return res.status(500).json({ message: 'Internal server error' });
    }
  };