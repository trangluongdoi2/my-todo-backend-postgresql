import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const config = {
  app_port: process.env.PORT || 9998,
  host:
    process.env.NODE_ENV === 'production'
      ? 'https://server.trangluongdoi2.com'
      : `http://localhost:${process.env.PORT}`,
  postgresql: {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    port: Number(process.env.POSTGRES_PORT),
    password: process.env.POSTGRES_PASSWORD,
  },
  jwt: {
    key: process.env.JWT_SECRET,
  },
  email_tranposter: {
    email: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  aws: {
    region: process.env.AWS_REGION || '',
    bucket: process.env.AWS_S3_BUCKET || '',
    access_key: process.env.AWS_ACCESS_KEY_ID || '',
    secret_key: process.env.AWS_ACCESS_SECRET_KEY || '',
    cognito_app_client_id: process.env.COGNITO_APP_CLIENT_ID || '',
    cognito_user_pool_id: process.env.COGNITO_USER_POOL_ID || '',
    cdn_url: process.env.CDN_URL || '',
  },
};
export default config;
