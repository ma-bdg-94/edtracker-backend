import UserController from "./user.controller";
import AuthController from "./auth.controller";
import DelegationController from "./delegation.controller";

export const userController = new UserController();
export const authController = new AuthController();
export const delegationController = new DelegationController();
