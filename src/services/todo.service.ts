import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import httpStatus from 'http-status';
import { TodoItem, TodoItemDetails } from '@/types/todo';
import { AppDataSource } from '@/config/db-connection';
import ApiError from '@/utils/apiError';
import { Project } from '@/entity/project.entity';
import { Todo } from '@/entity/todo.entity';
import { Attachment } from '@/entity/attachment.entity';
import { TodoStatusLog } from '@/entity/todo_status_log.entity';
import { User } from '@/entity/user.entity';
import { TodoComment } from '@/entity/todo_comment.entity';

class TodoService {
  private repository: Repository<Todo>;
  private projectRepository: Repository<Project>;
  private attachmentRepository: Repository<Attachment>;
  private todoStatusLogRepository: Repository<TodoStatusLog>;
  private todoCommentRepository: Repository<TodoComment>;
  private userRepository: Repository<User>;
  constructor() {
    this.repository = AppDataSource.getRepository(Todo);
    this.projectRepository = AppDataSource.getRepository(Project);
    this.attachmentRepository = AppDataSource.getRepository(Attachment);
    this.todoStatusLogRepository = AppDataSource.getRepository(TodoStatusLog);
    this.userRepository = AppDataSource.getRepository(User);
    this.todoCommentRepository = AppDataSource.getRepository(TodoComment);
  }
  async getTodos() {
    const todos = await this.repository.find();
    return todos;
  }

  async getTodoById(id: number) {
    const todo = await this.repository.createQueryBuilder('todo')
    .leftJoinAndSelect('todo.statusLogs', 'statusLogs')
    .orderBy('statusLogs.createdAt', 'DESC')
    .leftJoinAndSelect('statusLogs.user', 'user1')
    .leftJoinAndSelect('todo.attachments', 'attachments')
    .leftJoinAndSelect('todo.comments', 'comments')
    .leftJoinAndSelect('comments.user', 'user2')
    .where('todo.id = :id', { id })
    .select([
      'todo',
      'statusLogs',
      'attachments',
      'comments',
      'user1.id',
      'user1.username',
      'user1.email',
      'user2.id',
      'user2.username',
      'user2.email',
    ])
    .getOne();
    return todo;
  }

  async getTodoById2(id: number) {
    const todo = await this.repository.findOne({
      where: { id },
      relations: { statusLogs: true, attachments: true },
    })
    const { statusLogs = [] } = todo as any;
    const newStatusLogs = await Promise.all(statusLogs.map(async (statusLog: any) => {
      const res = await this.todoStatusLogRepository.createQueryBuilder('todoStatusLog')
        .leftJoin('todoStatusLog.user', 'user')
        .where('todoStatusLog.id = :id', { id: statusLog.id })
        .addSelect(['user.id', 'user.username', 'user.email'])
        .getMany();
      return res;
    }));
    return {
      ...todo,
      statusLogs: newStatusLogs,
    };
  }

  async getTodosByProjectId(projectId: number) {
    const todos = await this.repository.createQueryBuilder('todo')
      .leftJoin('todo.project', 'project')
      .where('project.id = :projectId', { projectId })
      .addSelect(['project.id', 'project.projectName'])
      .getMany();
    return todos;
  }

  async createTodoLog(input: any) {
    const { userId } = input;
    const user = await this.userRepository.findOneBy({ id: userId });
    const newTodoStatusLog = new TodoStatusLog();
    newTodoStatusLog.field = input.field as keyof TodoItem;
    newTodoStatusLog.oldValue = input.oldValue;
    newTodoStatusLog.newValue = input.newValue;
    newTodoStatusLog.action = input.action;
    newTodoStatusLog.user = user as User;
    const savedTodoStatusLog = await this.todoStatusLogRepository.save(newTodoStatusLog);
    return savedTodoStatusLog;
  }

  async createTodo(userId: number, input: TodoItem) {
    const inputLogs = {
      oldValue: '',
      newValue: '',
      field: '',
      action: 'create',
      userId,
    }
    const savedTodoStatusLog = await this.createTodoLog(inputLogs);
    const newTodo = {
      ...input,
      statusLogs: [savedTodoStatusLog],
    }
    const createdTodo = await this.repository.save(newTodo);
    const project = await this.projectRepository.findOne({
      where: {
        id: input.projectId,
      },
      relations: {
        todos: true,
      }
    });
    if (project) {
      project.todos = [...project.todos, createdTodo];
      await this.projectRepository.save(project);
    }
    return createdTodo;
  }

  async updateTodo(input: TodoItemDetails) {
    const { id } = input;
    const todoNeedUpdate = await this.repository.findOneBy({ id: id as any });
    const updatedTodo = await this.repository.save(todoNeedUpdate as any);
    return updatedTodo;
  }

  async updateTodoByField(userId: number, input: { id: string , field: string, value: any }) {
    const { id, field, value } = input;
    const todoNeedUpdate = await this.repository.findOne(
      {
        where: { id: id as any },
        relations: { statusLogs: true },
      }
    ) as Todo;
    if (!todoNeedUpdate) {
      throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Update todo failed!');
    }
    let newUpdateTodo;
    const inputLogs = {
      // @ts-ignore
      oldValue: todoNeedUpdate[field as keyof TodoItem],
      newValue: value,
      field,
      action: 'update',
    }
    const newTodoStatusLog = await this.createTodoLog(inputLogs);
    todoNeedUpdate.statusLogs = [...todoNeedUpdate.statusLogs, newTodoStatusLog];
    newUpdateTodo = { 
      ...todoNeedUpdate,
      [field]: value,
    }
    const updatedTodo = await this.repository.save(newUpdateTodo);
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
    const todo = await this.repository.findOne({
      where: { id },
      relations: { statusLogs: true, attachments: true, comments: true },
    })
    if (!todo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    const { statusLogs = [], attachments = [], comments = [] } = todo;
    statusLogs.forEach((statusLog: TodoStatusLog) => {
      this.todoStatusLogRepository.delete(statusLog.id);
    });
    attachments.forEach((attachment: Attachment) => {
      this.attachmentRepository.delete(attachment.id);
    });
    comments.forEach((comment: TodoComment) => {
      this.todoCommentRepository.delete(comment.id);
    });
    const deleteTodo = await this.repository.delete(id);
    return deleteTodo;
  }

  async getLogsByTodoId(todoId: number) {
    const logs = await this.todoStatusLogRepository.createQueryBuilder('todoStatusLog')
      .leftJoin('todoStatusLog.user', 'user')
      .where('todoStatusLog.todoId = :id', { id: todoId })
      .orderBy('todoStatusLog.createdAt', 'DESC')
      .addSelect(['user.id', 'user.username', 'user.email'])
      .getMany();
    return logs;
  }
}

export default new TodoService();