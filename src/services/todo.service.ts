import { Repository } from 'typeorm';
import { TodoItem, TodoItemDetails } from '@/common/type';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { Todo } from '@/entity/todo.entity';

class TodoService {
  private repository: Repository<Todo>;
  private projectRepository: Repository<Project>;
  constructor() {
    this.repository = AppDataSource.getRepository(Todo);
    this.projectRepository = AppDataSource.getRepository(Project);
  }
  async getTodoList() {
    try {
      const res = await this.repository.find();
      return {
        status: 200,
        message: "Todo list fetched successfully",
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
        data: [],
      }
    }
  }

  async getTodoById(id: string | number) {
    try {
      const res = await this.repository.findOneBy({ id: id as number });
      return {
        status: 200,
        message: '',
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Not Found...',
        data: null,
      }
    }
  }

  async queryTodoList(query?: Record<string, any>) {
    return {
      status: 200,
      message: 'queryTodoList',
      data: [],
    }
  }

  async getTodosListByProjectId(projectId: number) {
    const query = `select * from todo left join project on "todo"."projectId" = project.id where "todo"."projectId" = 25;`;
    try {
      const res = await this.repository.createQueryBuilder('todo')
        .leftJoin('todo.project', 'project')
        .where('project.id = :projectId', { projectId })
        .addSelect(['project.id', 'project.projectName'])
        .getMany();
      return {
        status: 200,
        message: 'getTodosListByProjectId',
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: 'getTodosListByProjectId',
        data: [],
      }
    }
  }

  async createTodo(input: TodoItem) {
    try {
      const res = await this.repository.save(input);
      const project = await this.projectRepository.findOne({
        where: {
          id: input.projectId,
        },
        relations: {
          todos: true,
        }
      });
      if (project) {
        project.todos = [...project.todos, res];
        await this.projectRepository.save(project);
      }
      return {
        status: 200,
        message: 'Todo created successfully',
        data: res,
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: 'Todo created failed',
        data: null,
      }
    }
  }

  async updateTodo(input: TodoItemDetails) {
    const { id } = input;
    const todoNeedUpdate = await this.repository.findOneBy({ id: id as any });
    await this.repository.save(todoNeedUpdate as any);
    return {
      status: 500,
      message: 'Todo update failed',
      data: null,
    }
  }

  async updateTodoByField(input: { id: string , field: string, value: any }) {
    try {
      const { id, field, value } = input;
      const todoNeedUpdate = await this.repository.findOneBy({ id: id as any });
      let newUpdateTodo;
      if (todoNeedUpdate) {
        newUpdateTodo = { 
          ...todoNeedUpdate,
          [field]: value,
        }
      }
      const res = await this.repository.save(newUpdateTodo as any);
      return {
        status: 200,
        message: `Update ${field} for todo sucessfully!`,
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Todo update failed',
        data: null,
      }
    }
  }

  async updateAttachments(input: { id: string, files: any[] }) {
    return {
      status: 500,
      message: 'Todo update failed',
      data: null,
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.repository.delete({ id: id });
      return {
        status: 200,
        message: 'Delete todo successfully!',
      }
    } catch (error) {
      return {
        status: 500,
        message: "Delete todo failed!"
      }
    }
  }
}

export default new TodoService();