import { Request, Response } from "express";
import { validationResult, Result } from "express-validator";
import { ValidationError } from "express-validator/src/base";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
} from "http-status";

import { User } from "../models";
import { ADMIN } from "../utilities/constants/types";
import { compare } from "bcryptjs";
import { signToken } from "../middlewares/authentication/manageTokens.middleware";

export default class UserController {
  async registerAdmin(req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const {
      firstNameAr,
      firstNameLa,
      lastNameAr,
      lastNameLa,
      sex,
      birthdate,
      email,
      phone,
      userType,
      password,
      cin,
    } = (req as any).body;

    try {
      let user: any = await User.findOne({
        $or: [{ email }, { phone }, { userType: ADMIN }],
      });
      if (user) {
        const cinMatch: boolean = await compare(cin, user.cin);
        if (cinMatch) {
          return res.status(CONFLICT).json({
            errors: [{ msg: "Already existing user with those credentials!" }],
          });
        }
        return res.status(CONFLICT).json({
          errors: [{ msg: "Already existing user with those credentials!" }],
        });
      }

      user = new User({
        userType: ADMIN,
        firstName: {
          ar: firstNameAr,
          la: firstNameLa,
        },
        lastName: {
          ar: lastNameAr,
          la: lastNameLa,
        },
        sex,
        birthdate,
        email,
        phone,
        password,
        cin,
      });

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = await signToken(payload);
      return res.status(CREATED).json({ token, message: "Admin Registered!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }
}
