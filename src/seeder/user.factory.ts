import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { User } from '@/entity/user.entity';

export const UserFactory = setSeederFactory(User, async () => {
  const user = new User();
  const salt = await bcrypt.genSalt(10);
  const password = '1';
  const hashPassword = await bcrypt.hash(password.toString(), salt);
  user.username = 'admin';
  user.email = 'admin@gmail.com';
  user.password = hashPassword;
  return user;
});
