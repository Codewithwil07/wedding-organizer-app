import { Router } from "express";
import authRouter from "./auth.routes";
import adminRouter from './admin.routes'; 
import appRouter from './app.routes'; 

const mainRouter = Router();

// Semua request ke /api/auth bakal diurus sama authRouter
mainRouter.use("/auth", authRouter);
mainRouter.use('/admin', adminRouter); 
mainRouter.use('/app', appRouter); 

export default mainRouter;
