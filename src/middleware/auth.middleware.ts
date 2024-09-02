import { Role } from '@/common/user';
import config from '@/config';
import { NextFunction, Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
class AuthMiddleWare {
  authentication(req: Request, res: Response, next: NextFunction) {
    next();
    // try {
    //   const header = req.headers?.authorization;
    //   if (!header) {
    //     return res.status(401).json({ message: "Unauthorized" });
    //   }
    //   const token = header.split(" ")[1];
    //   if (!token) {
    //     return res.status(401).json({ message: "Unauthorized" });
    //   }
    //   const decode = jwt.verify(token, config.jwt.key as string);
    //   if (!decode) {
    //     return res.status(401).json({ message: "Unauthorized" });
    //   }
    //   next();
    // } catch (error) {
    //   res.status(400).json({ message: 'Invalid token!' });
    // }
  }
  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers?.role;
      // console.log(header, 'header');
      if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if ((header as string).toUpperCase() === Role.ADMIN) {
        next();
      } else {
        res.status(400).json({ message: 'Permission denied!' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Permission denied!' });
    }
  }
}

export default new AuthMiddleWare;