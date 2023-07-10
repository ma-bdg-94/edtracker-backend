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
import { ADMIN, DELEGATE, userTypesEnum } from "../utilities/constants/types";
import { compare, genSalt, hash } from "bcryptjs";
import { signToken } from "../middlewares/authentication/manageTokens.middleware";
import sendDelegateCredentials from "../middlewares/emails/sendDelegateCredentials.middleware";

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
          type: user.userType,
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

  async addDelegate(req: Request, res: Response): Promise<any> {
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
      password,
      cin,
    } = (req as any).body;

    try {
      let delegate: any = await User.findOne({
        $or: [{ email }, { phone }],
        userType: DELEGATE,
      });

      let delegateList: any = await User.find({
        userType: DELEGATE,
        association: req.params.delegationId,
      });
      if (delegateList?.length > 0) {
        return res.status(CONFLICT).json({
          errors: [{ msg: "Already existing delegate in this delegation!" }],
        });
      }

      if (delegate) {
        const cinMatch: boolean = await compare(cin, delegate.cin);
        if (cinMatch) {
          console.log("cin match,", cinMatch);
          return res.status(CONFLICT).json({
            errors: [
              { msg: "Already existing delegate with those credentials!" },
            ],
          });
        }

        return res.status(CONFLICT).json({
          errors: [
            { msg: "Already existing delegate with those credentials!" },
          ],
        });
      }

      delegate = new User({
        association: req.params.delegationId,
        userType: DELEGATE,
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

      await delegate.save();
      await sendDelegateCredentials(
        email,
        password,
        delegate.firstName.ar,
        delegate.firstName.la,
        delegate.lastName.ar,
        delegate.lastName.la
      );
      return res
        .status(CREATED)
        .json({ delegate, message: "Delegate Registered!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getDelegateList(req: Request, res: Response): Promise<any> {
    try {
      let delegateList: any = await User.find({
        deleted: false,
        userType: DELEGATE,
      }).select("-password");
      if (delegateList?.length < 1) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegates!" }],
        });
      }

      return res.status(OK).json({ delegateList });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getDelegate(req: Request, res: Response): Promise<any> {
    try {
      let delegate: any = await User.findOne({
        _id: req.params.id,
        deleted: false,
      }).select("-password");
      if (!delegate) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegate!" }],
        });
      }

      return res.status(OK).json({ delegate });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async updateDelegate(req: Request, res: Response): Promise<any> {
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
      password,
      cin,
    } = (req as any).body;

    const delegateFields: any = {};
    if (firstNameAr) delegateFields["firstName.ar"] = firstNameAr;
    if (firstNameLa) delegateFields["firstName.la"] = firstNameLa;
    if (lastNameAr) delegateFields["lastName.ar"] = lastNameAr;
    if (lastNameLa) delegateFields["lastName.la"] = lastNameLa;
    if (sex) delegateFields["sex"] = sex;
    if (birthdate) delegateFields["birthdate"] = birthdate;
    if (email) delegateFields.email = email;
    if (phone) delegateFields.phone = phone;
    if (password) delegateFields.password = password;
    if (cin) delegateFields.cin = cin;

    try {
      let delegate: any = await User.findOne({
        userType: DELEGATE,
        _id: req.params.id,
        deleted: false,
      });
      if (!delegate) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegate!" }],
        });
      }

      const salt: any = await genSalt(parseInt(process.env.BCRYPTJS_ROUNDS!));
      if (password) delegateFields.password = await hash(password, salt);
      if (cin) delegateFields.cin = await hash(cin, salt);

      delegate = await User.findOneAndUpdate(
        { _id: req.params.id, userType: DELEGATE, deleted: false },
        { $set: delegateFields },
        { new: true }
      );

      return res.status(OK).json({ delegate, message: "Delegate Updated!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async removeDelegate(req: Request, res: Response): Promise<any> {
    try {
      let delegate: any = await User.findOne({ _id: req.params.id, deleted: false, userType: DELEGATE });
      if (!delegate) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegate!" }],
        });
      }

      delegate = await User.findOneAndUpdate({ _id: req.params.id, deleted: false, userType: DELEGATE }, { deleted: true }, { new: true })
      
      return res
        .status(OK)
        .json({ delegate, message: "Delegate Removed!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }
}
