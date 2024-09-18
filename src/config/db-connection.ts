import { DataSource } from "typeorm";
import { Project } from "@/entity/project.entity";
import { Todo } from "@/entity/todo.entity";
import { User } from "@/entity/user.entity";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'me',
  password: '',
  database: 'todo',
  synchronize: true,
  entities: [
    Project,
    Todo,
    User,
  ],
})