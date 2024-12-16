import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import config from '@/config';
import { MainSeeder } from './main.seeder';
import { User } from '@/entity/user.entity';
import { Project } from '@/entity/project.entity';
import { UserFactory } from './user.factory';
import { Todo } from '@/entity/todo.entity';
import { Attachment } from '@/entity/attachment.entity';
import { TodoStatusLog } from '@/entity/todo_status_log.entity';
import { TodoComment } from '@/entity/todo_comment.entity';
import { ProjectFactory } from './project.factorty';
import { TodoFactory } from './todo.factory';

const { host, port, user, password, database } = config.postgresql;

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host,
  port,
  username: user,
  password,
  database,
  entities: [User, Project, Todo, Attachment, TodoStatusLog, TodoComment],
  factories: [UserFactory, ProjectFactory, TodoFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit(0);
});
