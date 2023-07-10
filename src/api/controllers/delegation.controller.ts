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

import { Delegation } from "../models";

export default class DelegationController {
  async addDelegation(req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { nameAr, nameLa, long, lat, creationDate, email, phone } = (
      req as any
    ).body;

    try {
      let delegation: any = await Delegation.findOne({
        email
      });
      if (delegation) {
        console.log("error", delegation)
        return res.status(CONFLICT).json({
          errors: [{ msg: "Already existing delegation with this data!" }],
        });
      }

      delegation = new Delegation({
        name: {
          ar: nameAr,
          la: nameLa,
        },
        coordinates: {
          long,
          lat,
        },
        creationDate,
        email,
        phone,
      });

      await delegation.save();

      console.log("not error", delegation)
      return res
        .status(CREATED)
        .json({ delegation, message: "Delegation Added!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getDelegationList(req: Request, res: Response): Promise<any> {
    try {
      let delegationList: any = await Delegation.find({ deleted: false });
      if (delegationList?.length < 1) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegations!" }],
        });
      }

      return res.status(OK).json({ delegationList });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async getDelegation(req: Request, res: Response): Promise<any> {
    try {
      let delegation: any = await Delegation.findOne({ _id: req.params.id, deleted: false });
      if (!delegation) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegations!" }],
        });
      }

      return res.status(OK).json({ delegation });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async updateDelegation(req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { nameAr, nameLa, long, lat, creationDate, email, phone } = (
      req as any
    ).body;

    const delegationFields: any = {};
    if (nameAr) delegationFields['name.ar'] = nameAr;
    if (nameLa) delegationFields['name.la'] = nameLa;
    if (long) delegationFields['coordinates.long'] = long;
    if (lat) delegationFields['coordinates.lat'] = lat;
    if (creationDate) delegationFields.creationDate = creationDate;
    if (email) delegationFields.email = email;
    if (phone) delegationFields.phone = phone;

    try {
      let delegation: any = await Delegation.findOne({ _id: req.params.id, deleted: false });
      if (!delegation) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegations!" }],
        });
      }

      delegation = await Delegation.findOneAndUpdate({ _id: req.params.id }, { $set: delegationFields }, { new: true })
      
      return res
        .status(OK)
        .json({ delegation, message: "Delegation Updated!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }

  async removeDelegation(req: Request, res: Response): Promise<any> {
    try {
      let delegation: any = await Delegation.findOne({ _id: req.params.id, deleted: false });
      if (!delegation) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: "Could not find any delegations!" }],
        });
      }

      delegation = await Delegation.findOneAndUpdate({ _id: req.params.id }, { deleted: true }, { new: true })
      
      return res
        .status(OK)
        .json({ delegation, message: "Delegation Removed!" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send("Server Error! Something went wrong!");
    }
  }
}
