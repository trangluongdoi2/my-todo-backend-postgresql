import express, { Response } from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import todoRoute from '@/routes/todo.route';
import userRoute from '@/routes/user.route';
import addMemberRoute from '@/routes/confirmAddMember.route';
import projectRoute from '@/routes/project.route';
import { AppDataSource } from '@/config/db-connection';
import swaggerPlugin from '@/config/swagger';
import config from './config';

function initApp() {
  try {
    AppDataSource.initialize().then(() => {
      const app = express();
      app.use(cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: ['*'],
      }));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'jade');
    
      app.use('/api', userRoute);
      app.use('/api', todoRoute);
      app.use('/api', projectRoute);
      app.use('/api', addMemberRoute);
      app.get('/', (_, res: Response) => {
        res.send('<h1>My Todo App!!</h1>');
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