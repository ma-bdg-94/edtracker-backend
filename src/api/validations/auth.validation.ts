import { body, ValidationChain } from "express-validator";

export default class AuthValidation {
  validateLogin: ValidationChain[] = [
    body("email").not().isEmpty().withMessage("Email is required!"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required!")
      .exists()
      .withMessage("Password does not exist!"),
  ];
}
