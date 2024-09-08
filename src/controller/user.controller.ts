import { UserLogin } from '@/common/user';
import UserService from '@/services/user.service';
import { Request, Response } from 'express';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    const result = await UserService.getAllUser();
    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  }

  async register(req: Request, res: Response) {
    const { username = '', email = '', password = '' } = req.body;
    const input: any = {
      username,
      email,
      password
    }
    const result = await UserService.createUser(input);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  }

  async login(req: Request, res: Response) {
    const result = await UserService.login(req.body as UserLogin);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  }

  async logout(req: Request, res: Response) {
    console.log('logout...');
  }

  async findUserById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await UserService.findUserById(id);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
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