import dotenv from 'dotenv';
import config from '@/config';
import bcrypt from 'bcrypt';
import { Users } from '@/entity/user.entity'
import { AppDataSource } from '@/config/db-connection';
import { Repository } from 'typeorm';
dotenv.config();

type TInputCreateUser = {
  username: string,
  password: string,
  email: string
}
class UserServices {
  private entity: Repository<Users>;
  constructor() {
    this.entity = AppDataSource.getRepository(Users);
  }
  async createUser(input: TInputCreateUser) {
    try {
      const { username, email, password } = input;
      const newUser = new Users();
      newUser.username = username;
      newUser.email = email;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password.toString(), salt);
      newUser.password = hashPassword;
      const { password: hashedPassword, ...res } = await this.entity.save(newUser);
      return {
        status: 200,
        message: 'Created user successfully!',
        data: res,
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

  async findUserById(userId: string) {
    return {
      status: 200,
      message: 'Hehhe',
      data: null,
    }
  }

  async deleteUser(id: string) {
    return { 
      status: 200,
      message: 'Hehhe',
      data: null,
    }
  }

  // async fe
}

export default new UserServices();