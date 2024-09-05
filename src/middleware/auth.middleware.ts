import { NextFunction, Request, Response } from 'express';
import * as JWT from "jsonwebtoken";
import { Repository } from 'typeorm';
import { Role } from '@/common/user';
import config from '@/config';
import { AppDataSource } from '@/config/db-connection';
import { Users } from '@/entity/user.entity';
class AuthMiddleWare {
  private entity: Repository<Users>
  constructor() {
    this.entity = AppDataSource.getRepository(Users);
  }
  authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers?.authorization;
      if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = header.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decode = JWT.verify(token, config.jwt.key as string);
      if (!decode) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token!' });
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const res = JWT.verify(refreshToken, config.jwt.key as string) as JWT.JwtPayload;
      console.log(res, 'verifyRefreshToken...');
      const user = await this.entity.findOneBy({ id: res?.id });
      if (user) {
        return user.id;
      }
    } catch (error) {
      return undefined;
    }
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers?.role;
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