import { body, ValidationChain } from "express-validator";

export default class DelegationValidation {
  validateDelegation: ValidationChain[] = [
    body("nameAr")
      .not()
      .isEmpty()
      .withMessage("Delegation arabic name is required!"),
    body("nameLa")
      .not()
      .isEmpty()
      .withMessage("Delegation latin name is required!"),
    body("long")
      .not()
      .isEmpty()
      .withMessage("Delegation longitude is required!"),
    body("lat").not().isEmpty().withMessage("Delegation latitude is required!"),
    body("creationDate")
      .not()
      .isEmpty()
      .withMessage("Delegation creation date is required!")
      .isDate()
      .withMessage("Wrong date format!"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Admin email is required!")
      .isEmail()
      .withMessage("Email format is not authorized"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Admin phone is required!")
      .isMobilePhone("any")
      .withMessage("Phone format is not authorized"),
  ];

  validateDelegationUpdate: ValidationChain[] = [
    body("creationDate")
      .isDate()
      .withMessage("Wrong date format!"),
    body("email")
      .isEmail()
      .withMessage("Email format is not authorized"),
    body("phone")
      .isMobilePhone("any")
      .withMessage("Phone format is not authorized"),
  ];
}
