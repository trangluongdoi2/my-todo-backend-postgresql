import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { TodoItem, TodoItemDetails } from '@/common/type';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { Todo } from '@/entity/todo.entity';
import { Attachment } from '@/entity/attachment.entity';
import ApiError from '@/utils/apiError';
import httpStatus from 'http-status';

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
    const todos = await this.repository.find();
    return todos;
  }

  async getTodoById(id: number) {
    const todo = await this.repository.findOne({
      where: { id },
      relations: { attachments: true },
    });
    return todo;
  }

  async getTodosByProjectId(projectId: number) {
    const todos = await this.repository.createQueryBuilder('todo')
      .leftJoin('todo.project', 'project')
      .where('project.id = :projectId', { projectId })
      .addSelect(['project.id', 'project.projectName'])
      .getMany();
    return todos;
  }

  async createTodo(input: TodoItem) {
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
    return res;
  }

  async updateTodo(input: TodoItemDetails) {
    const { id } = input;
    const todoNeedUpdate = await this.repository.findOneBy({ id: id as any });
    const updatedTodo = await this.repository.save(todoNeedUpdate as any);
    return updatedTodo;
  }

  async updateTodoByField(input: { id: string , field: string, value: any }) {
    const { id, field, value } = input;
    const todoNeedUpdate = await this.repository.findOneBy({ id: id as any });
    let newUpdateTodo;
    if (todoNeedUpdate) {
      newUpdateTodo = { 
        ...todoNeedUpdate,
        [field]: value,
      }
    }
    const updatedTodo = await this.repository.save(newUpdateTodo as any);
    return updatedTodo;
  }

  async updateAttachments(input: { id: number, files: any[] }) {
    const todoItem = await this.repository.findOne({
      where: { id: input.id },
      relations: { attachments: true }
    });
    if (!todoItem) {
      throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Update todo failed!');
    }
    const objectNewUrls = input.files.map((file: any) => ({ id: uuidv4(), ...file }))
    const newAttachments = await this.attachmentRepository.save(objectNewUrls);
    todoItem.attachments = [...todoItem?.attachments || [], ...newAttachments];
    const updatedTodo = await this.repository.save(todoItem);
    return updatedTodo;
  }

  async deleteTodo(id: number) {
    const deletedTodo = await this.repository.delete({ id: id });
    return deletedTodo;
  }
}

export default new TodoService();