import express, { Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoute from '@/routes/auth.route';
import todoRoute from '@/routes/todo.route';
import userRoute from '@/routes/user.route';
import swaggerPlugin from '@/config/swagger';
import config from './config';
import { AppDataSource } from '@/config/db-connection';

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
  try {
    AppDataSource.initialize().then(() => {
      const app = express();
      app.use(cors(configsCors));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
    
      app.use('/api', authRoute);
      app.use('/api', todoRoute);
      app.use('/api', userRoute);
      app.get('/', (_, res: Response) => {
        res.send('<h1>My Todo App WTF!!</h1>');
      });
      swaggerPlugin(app);
      app.listen(config.app_port, () => {
        const url = `http://localhost:${config.app_port}`;
        console.log(`App is running on ${url}`);
        console.log(`Swagger is running on ${url}/api-docs`);
      });
    }) 
  } catch (error) {
    console.log(`Database connection failed with error ${error}`);
  }
}

initApp();