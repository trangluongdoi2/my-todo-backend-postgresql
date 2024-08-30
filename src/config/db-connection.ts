import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'me',
  password: '',
  database: 'todo',
  synchronize: true,
  entities: ["src/entity/*.ts"],
})