import { Request, Response } from "express";
import { validationResult, Result } from "express-validator";
import { ValidationError } from "express-validator/src/base";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "http-status";

import { User } from "../models";
import { ADMIN } from "../utilities/constants/types";
import { compare } from "bcryptjs";
import { signToken } from "../middlewares/authentication/manageTokens.middleware";
import sendPasswordEmail from "../middlewares/emails/sendPasswordEmail.middleware";

export default class AuthController {
  async loginUser(req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { email, password } = (req as any).body;

    try {
      let user: any = await User.findOne({ email });
      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find user with those credentials!" }],
        });
      }

      const isMatch: boolean = await compare(password, user.password);
      if (!isMatch) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find user with those credentials!" }],
        });
      }

      const payload: any = {
        user: {
          id: user.id,
          type: user.userType
        },
      };

      const token = await signToken(payload);
      return res.status(OK).json({ token, message: "Logged In Sucessfully!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getAuthenticatedUser(req: Request, res: Response): Promise<any> {
    try {
      let user: any = await User.findOne({ _id: (req as any).user.id });
      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find user!" }],
        });
      }

      return res.status(OK).json({ user });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async requestPasswordChange(req: Request, res: Response): Promise<any> {
    const { email } = (req as any).body;
    try {
      const user: any = await User.findOne({ email });
      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Cannot find user with those credentials!" }],
        });
      }
      const payload: any = {
        user: {
          id: user.id,
          type: user.userType
        },
      };
      const token = await signToken(payload);
      await sendPasswordEmail(
        email,
        token,
        user.firstNameAr,
        user.firstNameLa,
        user.lastNameAr,
        user.lastNameLa
      );
      res.status(CREATED).json({ msg: "Email sent!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }
}
