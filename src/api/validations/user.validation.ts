import { body, ValidationChain } from "express-validator";
import { sexTypesEnum } from "../utilities/constants/types";

export default class UserValidation {
  validateAdmin: ValidationChain[] = [
    body("firstNameAr")
      .not()
      .isEmpty()
      .withMessage("Admin arabic first name is required!"),
    body("firstNameLa")
      .not()
      .isEmpty()
      .withMessage("Admin latin first name is required!"),
    body("firstNameAr")
      .not()
      .isEmpty()
      .withMessage("Admin arabic last name is required!"),
    body("firstNameLa")
      .not()
      .isEmpty()
      .withMessage("Admin latin last name is required!"),
    body("sex")
      .not()
      .isEmpty()
      .withMessage("Admin sex is required!")
      .isIn(sexTypesEnum)
      .withMessage("Admin sex must be either Male (M) or Female (F)!"),
    body("birthdate")
      .not()
      .isEmpty()
      .withMessage("Admin birthdate is required!")
      .isDate()
      .withMessage("Wrong birthdate format!"),
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
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 10 })
      .withMessage("Password must contain at least 10 characters!"),
    body("cin")
      .not()
      .isEmpty()
      .withMessage("CIN is required!")
      .isNumeric()
      .withMessage("CIN must contain 8 numbers!")
      .isLength({ min: 8, max: 8 })
      .withMessage("CIN must contain 8 numbers!"),
  ];

  validateDelegate: ValidationChain[] = [
    body("firstNameAr")
      .not()
      .isEmpty()
      .withMessage("Delegate arabic first name is required!"),
    body("firstNameLa")
      .not()
      .isEmpty()
      .withMessage("Delegate latin first name is required!"),
    body("firstNameAr")
      .not()
      .isEmpty()
      .withMessage("Delegate arabic last name is required!"),
    body("firstNameLa")
      .not()
      .isEmpty()
      .withMessage("Delegate latin last name is required!"),
    body("sex")
      .not()
      .isEmpty()
      .withMessage("Delegate gender is required!")
      .isIn(sexTypesEnum)
      .withMessage("Delegate gender must be either Male (M) or Female (F)!"),
    body("birthdate")
      .not()
      .isEmpty()
      .withMessage("Delegate birthdate is required!")
      .isDate()
      .withMessage("Wrong birthdate format!"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Delegate email is required!")
      .isEmail()
      .withMessage("Email format is not authorized"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Delegate phone is required!")
      .isMobilePhone("any")
      .withMessage("Phone format is not authorized"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 10 })
      .withMessage("Password must contain at least 10 characters!"),
    body("cin")
      .not()
      .isEmpty()
      .withMessage("CIN is required!")
      .isNumeric()
      .withMessage("CIN must contain 8 numbers!")
      .isLength({ min: 8, max: 8 })
      .withMessage("CIN must contain 8 numbers!"),
  ];

  validateDelegateUpdate: ValidationChain[] = [
    body("sex")
      .isIn(sexTypesEnum)
      .withMessage("Delegate gender must be either Male (M) or Female (F)!"),
    body("birthdate").isDate().withMessage("Wrong birthdate format!"),
    body("email").isEmail().withMessage("Email format is not authorized"),
    body("phone")
      .isMobilePhone("any")
      .withMessage("Phone format is not authorized"),
    body("password")
      .isLength({ min: 10 })
      .withMessage("Password must contain at least 10 characters!"),
    body("cin")
      .isNumeric()
      .withMessage("CIN must contain 8 numbers!")
      .isLength({ min: 8, max: 8 })
      .withMessage("CIN must contain 8 numbers!"),
  ];
}
