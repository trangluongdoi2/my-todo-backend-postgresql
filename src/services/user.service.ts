import dotenv from 'dotenv';
import config from '@/config';
import pool from '@/config/database';
dotenv.config();


type TInputCreateUser = {
  name: string,
  password: string,
  email: string
}
class UserServices {
  async createUser(input: TInputCreateUser) {
    const { name, email, password } = input;
    console.log(input, 'input..');
    try {
      const queryStream = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
      pool.query(queryStream, [name, email, password], (error: any, results: any) => {
        if (error) {
          throw new Error();
        }
        console.log(results, 'results..');
      })
    } catch (error) {
    }
    return null;
  }
}

export default new UserServices();