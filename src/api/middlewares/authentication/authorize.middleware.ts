import { Request, Response, NextFunction } from 'express';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status';
import { verify } from 'jsonwebtoken';
import { User } from '../../models';

interface DecodedToken {
  user: any;
  type: string;
  iat: number;
  exp: number;
}

export default function authorize(userTypes?: string | string[]) {
  return function (req: Request, res: Response, next: NextFunction): any {
    const token = req.header('Authorize');

    if (!token) {
      return res
        .status(UNAUTHORIZED)
        .json({ msg: 'Token not found or invalid! Access denied' });
    }

    try {
      const decryptedToken = verify(token, process.env.JWT_SECRET!) as DecodedToken;
      
      if (userTypes) {
        const requiredTypes = Array.isArray(userTypes) ? userTypes : [userTypes];
        if (!requiredTypes.includes(decryptedToken.user.type)) {
          console.log({requiredTypes, decryptedToken})
          return res
            .status(FORBIDDEN)
            .json({ msg: 'Unauthorized! Access denied' });
        }
      }

      (req as any).user = decryptedToken.user;
      next();
    } catch (err: any) {
      res.status(UNAUTHORIZED).json({ msg: 'Token not found or invalid! Access denied' });
    }
  };
}
