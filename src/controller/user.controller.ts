import { UserLogin } from '@/common/user';
import UserService from '@/services/user.service';
import { catchAsync } from '@/utils/catchAsync';
import { pick } from '@/utils/pick';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export class UserController {

  register = catchAsync(async (req: Request, res: Response) => {
    const { username, email, password } = pick(req.body, ['username', 'email', 'password']);
    const input: any = {
      username,
      email,
      password
    }
    const newUser = await UserService.createUser(input);
    res.status(httpStatus.OK).send({
      message: 'Register successfully!',
      data: newUser,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.login(req.body as UserLogin);
    res.status(httpStatus.OK).send({
      message: 'Login successfully',
      data: user
    });
  });

  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAllUser();
    res.status(httpStatus.OK).send({
      message: 'Get all users successfully!',
      data: users,
    });
  });

  async logout(req: Request, res: Response) {
    console.log('logout...');
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await UserService.getUserById(Number(id));
    res.status(httpStatus.OK).send({
      message: 'Get user successfully!',
      data: result,
    });
  }

  async getRefreshToken(req: Request, res: Response) {
    const { refreshToken = '' } = req.body;
    const data = await UserService.getRefreshToken(refreshToken);
    res.json({
      data,
    })
  }
}

export default new UserController();