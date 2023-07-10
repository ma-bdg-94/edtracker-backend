import express, { Router } from "express";
const router: Router = express.Router();

import { delegationValidation, userValidation } from "../validations";
const { validateDelegation, validateDelegationUpdate } = delegationValidation;
const { validateDelegate, validateDelegateUpdate } = userValidation;

import { delegationController, userController } from "../controllers";
const {
  addDelegation,
  getDelegationList,
  getDelegation,
  updateDelegation,
  removeDelegation,
} = delegationController;
const { addDelegate, getDelegateList, getDelegate, updateDelegate, removeDelegate } =
  userController;

import authorize from "../middlewares/authentication/authorize.middleware";
import { ADMIN, DELEGATE } from "../utilities/constants/types";

router.post("/", [authorize(ADMIN), validateDelegation as any], addDelegation);
router.post(
  "/delegates/:delegationId",
  [authorize(ADMIN), validateDelegate as any],
  addDelegate
);

router.get("/delegations", authorize(), getDelegationList);
router.get("/delegations/:id", authorize(), getDelegation);
router.get("/delegates", authorize(), getDelegateList);
router.get("/delegates/:id", authorize(), getDelegate);

router.put(
  "/delegations/:id",
  [authorize([ADMIN, DELEGATE]), validateDelegationUpdate as any],
  updateDelegation
);
router.put(
  "/delegates/:id",
  [authorize(DELEGATE), validateDelegateUpdate as any],
  updateDelegate
);
router.put("/delegations/remove/:id", authorize(ADMIN), removeDelegation);
router.put("/delegates/remove/:id", authorize(ADMIN), removeDelegate);

export default router;
