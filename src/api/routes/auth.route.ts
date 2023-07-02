import express, { Router } from "express";
const router: Router = express.Router();

import { userValidation, authValidation } from "../validations";
const { validateAdmin } = userValidation;
const { validateLogin } = authValidation;

import { userController, authController } from "../controllers";
const { registerAdmin } = userController;
const { loginUser, getAuthenticatedUser, requestPasswordChange } = authController;

import authorize from "../middlewares/authentication/authorize.middleware";

router.post("/register", validateAdmin as any, registerAdmin);
router.post("/", validateLogin as any, loginUser);
router.post("/password", requestPasswordChange)

router.get("/", authorize(), getAuthenticatedUser)

export default router;
