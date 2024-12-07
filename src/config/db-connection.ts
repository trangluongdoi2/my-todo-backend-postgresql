import { DataSource } from "typeorm";
import { Project } from "@/entity/project.entity";
import { Todo } from "@/entity/todo.entity";
import { User } from "@/entity/user.entity";
import { Attachment } from "@/entity/attachment.entity";
import { TodoStatusLog } from "@/entity/todo_status_log.entity";
import { TodoComment } from "@/entity/todo_comment.entity";
import config from "./index";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.postgresql.host,
  port: config.postgresql.port,
  username: config.postgresql.user,
  password: config.postgresql.password,
  database: config.postgresql.database,
  synchronize: true,
  entities: [
    User,
    Project,
    Todo,
    Attachment,
    TodoStatusLog,
    TodoComment,
  ],
})