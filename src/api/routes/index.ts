import express, { Router } from "express";
const router: Router = express.Router();

import authRoutes from "./auth.route";

router.use("/api/auth", authRoutes);

export default router;
