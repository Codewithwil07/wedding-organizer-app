// File ini 'memperluas' tipe data Request bawaan Express
import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: User; 
    }
  }
}