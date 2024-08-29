import { CognitoUserPool } from "amazon-cognito-identity-js";
import config from '@/config';

const cognitoService = {
  createUserPool: () => {
    const poolData = {
      UserPoolId : config.aws.cognito_user_pool_id,
      ClientId : config.aws.cognito_app_client_id,
    }
    const userPool = new CognitoUserPool(poolData);
    return userPool;
  }
}

export default cognitoService;