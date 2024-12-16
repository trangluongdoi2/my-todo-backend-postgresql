import { NextFunction, Request, Response } from 'express';
import * as JWT from 'jsonwebtoken';
import { Repository } from 'typeorm';
import httpStatus from 'http-status';
import { RoleUser } from '@/common/user';
import config from '@/config';
import { AppDataSource } from '@/config/db-connection';
import { User } from '@/entity/user.entity';
import ApiError from '@/utils/apiError';

class AuthMiddleWare {
  private entity: Repository<User>;
  constructor() {
    this.entity = AppDataSource.getRepository(User);
  }
  authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers?.authorization;
      if (!header) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }
      const token = header.split(' ')[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }
      const decode = JWT.verify(token, config.jwt.key as string);
      if (!decode) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }
      next();
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const res = JWT.verify(refreshToken, config.jwt.key as string) as JWT.JwtPayload;
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
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if ((header as string).toUpperCase() === RoleUser.ADMIN) {
        next();
      } else {
        res.status(400).json({ message: 'Permission denied!' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Permission denied!' });
    }
  }
}

export default new AuthMiddleWare();
