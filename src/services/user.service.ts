import * as bcrypt from 'bcrypt';
import { User } from '@/entity/user.entity'
import { AppDataSource } from '@/config/db-connection';
import { UserCreate, UserLogin } from '@/common/user';
import { Repository } from 'typeorm';
import Encrypt from '@/helpers/encrypt';
import AuthMiddleWare from '@/middleware/auth.middleware';

class UserServices {
  private entity: Repository<User>;
  constructor() {
    this.entity = AppDataSource.getRepository(User);
  }

  async getAllUser() {
    try {
      const res = await this.entity.createQueryBuilder('User')
        .select('User.username, User.email, User.role')
        .execute();
      return {
        status: 200,
        message: 'Fetch all User!',
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Fetch all User failed!',
        data: null,
      }
    }
  }

  async createUser(input: UserCreate) {
    try {
      const { username, email, password } = input;
      const newUser = new User();
      newUser.username = username;
      newUser.email = email;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password.toString(), salt);
      newUser.password = hashPassword;
      const { password: hashedPassword, ...res } = await this.entity.save(newUser);
      const accessToken = Encrypt.generateToken({ id: res.id.toString() });
      const refreshToken = Encrypt.generateToken({ id: res.id.toString() });
      return {
        status: 200,
        message: 'Created user successfully!',
        data: {
          ...res,
          accessToken,
          refreshToken,
        },
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Created user failed!',
        data: null,
      };
    }
  }

  async login(input: UserLogin) {
    const { username, password } = input;
    try {
      const user = await this.entity.findOneBy({ username });
      if (!user) {
        return {
          status: 404,
          message: 'User is not exist!',
          data: null
        };
      }
      const flag = await bcrypt.compare(password.toString(), user.password);
      if (!flag) {
        return {
          status: 404,
          message: 'Password is not match!',
          data: null
        }
      }
      const accessToken = Encrypt.generateToken({ id: user.id });
      const refreshToken = Encrypt.generateRefreshToken({ id: user.id });
      const { password: hashedPassword, ...args } = user;
      return {
        status: 200,
        message: 'Login successfully!',
        data: {
          ...args,
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error!',
        data: null
      }
    }
  }

  async logout(input: any) {
  }

  async getRefreshToken(token: string) {
    const id = await AuthMiddleWare.verifyRefreshToken(token);
    if (!id) {
      return {
        status: 401,
        message: 'Invalid token!',
      }
    }
    const newToken = Encrypt.generateToken({ id });
    return {
      status: 200,
      accessToken: newToken,
    };
  }

  async findUserById(userId: string) {
    return {
      status: 200,
      message: 'Hehhe',
      data: null,
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.entity.findOneBy({ id: Number(id) })
      if (user) {
        this.entity.remove(user);
      }
      return { 
        status: 200,
        message: 'Delete user successfully!',
        data: null,
      }
    } catch (error) {
      return {
        status: 500,
        message: JSON.stringify(error),
        data: null,
      }
    }
  }
}

export default new UserServices();