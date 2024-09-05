import * as bcrypt from 'bcrypt';
import { Users } from '@/entity/user.entity'
import { AppDataSource } from '@/config/db-connection';
import { UserCreate, UserLogin } from '@/common/user';
import { Repository } from 'typeorm';
import Encrypt from '@/helpers/encrypt';
import AuthMiddleWare from '@/middleware/auth.middleware';

class UserServices {
  private entity: Repository<Users>;
  constructor() {
    this.entity = AppDataSource.getRepository(Users);
  }

  async createUser(input: UserCreate) {
    try {
      const { username, email, password } = input;
      const newUser = new Users();
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
      console.log(error, 'error...');
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
      return {
        status: 200,
        message: 'Login successfully!',
        data: {
          username: user.username,
          email: user.email,
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      return {
        status: 500,
        message: 'User is not exist!',
        data: null
      }
    }
  }

  async logout(input: any) {
    console.log(input, 'logout..');
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

  async deleteUser(id: string) {
    try {
      const user = await this.entity.findOneBy({ userId: id })
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