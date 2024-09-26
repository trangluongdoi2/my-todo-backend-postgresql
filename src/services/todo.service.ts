import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { TodoItem, TodoItemDetails } from '@/common/type';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { Todo } from '@/entity/todo.entity';
import { Attachment } from '@/entity/attachment.entity';

class TodoService {
  private repository: Repository<Todo>;
  private projectRepository: Repository<Project>;
  private attachmentRepository: Repository<Attachment>;
  constructor() {
    this.repository = AppDataSource.getRepository(Todo);
    this.projectRepository = AppDataSource.getRepository(Project);
    this.attachmentRepository = AppDataSource.getRepository(Attachment);
  }
  async getTodos() {
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

  async getTodoById(id: number) {
    try {
      const res = await this.repository.findOne({
        where: { id },
        relations: { attachments: true },
      });
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

  async getTodosListByProjectId(projectId: number) {
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

  async updateAttachments(input: { id: number, files: any[] }) {
    const todoItem = await this.repository.findOne({
      where: { id: input.id },
      relations: { attachments: true }
    });
    if (!todoItem) {
      return {
        status: 500,
        message: 'Todo update failed',
        data: null,
      }
    }
    const objectNewUrls = input.files.map((file: any) => ({ id: uuidv4(), ...file }))
    const newAttachments = await this.attachmentRepository.save(objectNewUrls);
    todoItem.attachments = [...todoItem?.attachments || [], ...newAttachments];
    const res = await this.repository.save(todoItem);
    return {
      status: 200,
      message: 'Todo update successfully!',
      data: res,
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