import dotenv from 'dotenv';

dotenv.config();
const config = {
  app_port: process.env.PORT || 9998,
  postgresql: {
    user: 'me',
    host: 'localhost',
    database: 'todo',
    port: 5432,
    password: '',
  },
  jwt: {
    key: process.env.JWT_SECRET,
  },
  aws: {
    region: process.env.AWS_REGION || '',
    bucket: process.env.AWS_S3_BUCKET || '',
    access_key: process.env.AWS_ACCESS_KEY_ID || '',
    secret_key: process.env.AWS_ACCESS_SECRET_KEY || '',
    cognito_app_client_id: process.env.COGNITO_APP_CLIENT_ID || '',
    cognito_user_pool_id: process.env.COGNITO_USER_POOL_ID || '',
  }
}
export default config;