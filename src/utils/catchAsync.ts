import logger from '@/logger/logger';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
    .then((data) => {
      logger.info(data);
    })
    .catch((err) => {
      logger.error(err);
      res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};
