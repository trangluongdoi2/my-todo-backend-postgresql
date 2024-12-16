import jwt from 'jsonwebtoken';
import config from '@/config';

const OPTIONS = {
  ACCESS_TOKEN_TIME_ALIVE: '1h', // 1 hour
  REFRESH_TOKEN_TIME_ALIVE: '1d', // 1 day
  // ACCESS_TOKEN_TIME_ALIVE: '10s', // 1 hour
  // REFRESH_TOKEN_TIME_ALIVE: '20s', // 1 day
};

class Encrypt {
  generateToken(payload: Record<string, any>) {
    return jwt.sign(payload, config.jwt.key as string, { expiresIn: OPTIONS.ACCESS_TOKEN_TIME_ALIVE });
  }
  generateRefreshToken(payload: Record<string, any>) {
    return jwt.sign(payload, config.jwt.key as string, { expiresIn: OPTIONS.REFRESH_TOKEN_TIME_ALIVE });
  }
  getInfoFromToken(token: string) {
    return jwt.verify(token, config.jwt.key as string);
  }
}

export default new Encrypt();
