import express, { Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoute from '@/routes/auth.route';
import todoRoute from '@/routes/todo.route';
import swaggerPlugin from '@/config/swagger';
import config from './config';

function initApp() {
  const configsCors = {
    origin: '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
    ],
    allowedHeaders: [
      'Content-Type',
    ],
  }
  const app = express();
  app.use(cors(configsCors));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/api', authRoute);
  app.use('/api', todoRoute);
  app.get('/', (_, res: Response) => {
    res.send('<h1>My Todo App</h1>');
  });
  swaggerPlugin(app);
  app.listen(config.app_port, () => {
    const url = `http://localhost:${config.app_port}`;
    console.log(`App is running on ${url}`);
    console.log(`Swagger is running on ${url}/api-docs`);
  });
}

initApp();