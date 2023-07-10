import express, { Router } from "express";
const router: Router = express.Router();

import authRoutes from "./auth.route";
import delegationRoutes from "./delegation.route"

router.use("/api/auth", authRoutes);
router.use("/api/delegations", delegationRoutes)

export default router;
