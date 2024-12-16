import * as bcrypt from 'bcrypt';
import { User } from '@/entity/user.entity';
import { AppDataSource } from '@/config/db-connection';
import { UserCreate, UserLogin } from '@/common/user';
import { Repository } from 'typeorm';
import Encrypt from '@/helpers/encrypt';
import AuthMiddleWare from '@/middleware/auth.middleware';
import ApiError from '@/utils/apiError';
import httpStatus from 'http-status';

class UserServices {
  private entity: Repository<User>;
  constructor() {
    this.entity = AppDataSource.getRepository(User);
  }

  async getAllUser() {
    const res = await this.entity.createQueryBuilder('User').select('User.username, User.email, User.role').execute();
    return res;
  }

  async createUser(input: UserCreate) {
    const { username, email, password } = input;
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password.toString(), salt);
    newUser.password = hashPassword;
    const { password: hashedPassword, ...res } = await this.entity.save(newUser);
    const accessToken = Encrypt.generateToken({ userId: res.id.toString() });
    const refreshToken = Encrypt.generateToken({ userId: res.id.toString() });
    return {
      ...res,
      accessToken,
      refreshToken,
    };
  }

  async login(input: UserLogin) {
    const { username, password } = input;
    const user = await this.entity.findOneBy({ username });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User is not exist!');
    }
    const flag = await bcrypt.compare(password.toString(), user.password);
    if (!flag) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is not match!');
    }
    const accessToken = Encrypt.generateToken({ userId: user.id });
    const refreshToken = Encrypt.generateRefreshToken({ userId: user.id });
    const { password: hashedPassword, ...args } = user;
    return {
      ...args,
      accessToken,
      refreshToken,
    };
  }

  async logout(input: any) {
    console.log(input);
  }

  async getRefreshToken(token: string) {
    const id = await AuthMiddleWare.verifyRefreshToken(token);
    if (!id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token!');
    }
    return {
      accessToken: Encrypt.generateToken({ userId: id }),
    };
  }

  async getUserById(id: number) {
    const user = await this.entity.findOneBy({ id });
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User is not exist!');
    }
    const result = await this.entity.remove(user);
    return result;
  }
}

export default new UserServices();
