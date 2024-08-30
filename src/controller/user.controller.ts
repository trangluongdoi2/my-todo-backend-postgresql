import UserService from '@/services/user.service';
import { Request, Response } from 'express';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    res.status(200).json({
      message: 'Noo',
      data: [],
    });
  }

  async createUser(req: Request, res: Response) {
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

  async findUserById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await UserService.findUserById(id);
    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  }
}

export default new UserController();