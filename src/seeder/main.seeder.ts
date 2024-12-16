import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "@/entity/user.entity";
import { Project } from "@/entity/project.entity";
import { Todo } from "@/entity/todo.entity";

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(User);
    const projectFactory = factoryManager.get(Project);
    const todoFactory = factoryManager.get(Todo);
    const todoItems = Array.from({ length: 30 }, async () => {
      return todoFactory.save();
    });
    const project = new Project();
    project.todos = await Promise.all(todoItems);
    const savedProject = await projectFactory.save(project);
    const user = new User();
    user.projects = [savedProject];
    await userFactory.save(user);
  }
}