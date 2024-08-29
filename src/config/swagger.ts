import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerJs from 'swagger.json';

const swaggerPlugin = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJs));
  return {
    specs: swaggerJs,
    swaggerUi: swaggerUi,
  }
}

export default swaggerPlugin;
