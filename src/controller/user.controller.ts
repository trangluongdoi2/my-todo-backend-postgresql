import UserService from '@/services/user.service';
import { Request, Response } from 'express';

export class UserController {
  async createUser(req: Request, res: Response) {
    const { name = '', email = '', password = '' } = req.body;
    const input: any = {
      name,
      email,
      password
    }
    const result = await UserService.createUser(input);
    res.status(200).json({
      message: 'Noo',
      data: result,
    });
  }
}

export default new UserController();