import { Repository } from "typeorm";
import { AppDataSource } from "@/config/db-connection";
import { TCreateTodoLog } from "@/types/todo";
import { Todo } from "@/entity/todo.entity";
import { TodoComment } from "@/entity/todo_comment.entity";
import { User } from "@/entity/user.entity";
import TodoService from "./todo.service";

class TodoCommentService {
  private repository: Repository<TodoComment>;
  private todoRepository: Repository<Todo>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(TodoComment);
    this.todoRepository = AppDataSource.getRepository(Todo);
    this.userRepository = AppDataSource.getRepository(User);
  }

  private async createTodoLog(input: any) {
    const { userId, oldValue, newValue, action, todoId } = input;
    const todoNeedUpdate = await this.todoRepository.findOne(
      {
        where: { id: todoId },
        relations: { statusLogs: true },
      }
    ) as Todo;
    if (!todoNeedUpdate) {
      throw new Error('Todo not found');
    }
    const inputLogs: TCreateTodoLog = {
      oldValue,
      newValue,
      field: 'comment',
      action,
      userId,
    }
    const newTodoStatusLog = await TodoService.createTodoLog(inputLogs);
    todoNeedUpdate.statusLogs = [...todoNeedUpdate.statusLogs, newTodoStatusLog];
    await this.todoRepository.save(todoNeedUpdate);
    return newTodoStatusLog;
  }

  async create(todoId: number, data: any) {
    const todo = await this.todoRepository.findOne(
      { where: { id: todoId }, relations: ['comments'] }
    );
    if (!todo) {
      throw new Error('Todo not found');
    }
    const { userId } = data;
    const user = await this.userRepository.findOneBy(
      { id: userId }
    );
    const comment = new TodoComment();
    comment.content = data.content;
    comment.user = user as User;
    const savedComment = await this.repository.save(comment);
    todo.comments.push(savedComment);
    await this.todoRepository.save(todo);
    this.createTodoLog({
      oldValue: '',
      newValue: data.content,
      action: 'create',
      userId,
      todoId,
    });
    return savedComment;
  }

  async update(commentId: string, data: any) {
    const comment = await this.repository.findOne(
      { where: { id: commentId }, relations: ['todo'] }
    );
    if (!comment) {
      throw new Error('Comment not found');
    }
    const { userId, todoId } = data;
    const { content: oldContent } = comment;
    const todo = await this.todoRepository.findOne(
      { where: { id: todoId }, relations: ['comments'] }
    );
    if (!todo) {
      throw new Error('Todo not found');
    }
    comment.content = data.content;
    const savedComment = await this.repository.save(comment);
    todo.comments = todo.comments.map((comment: any) => comment.id === savedComment.id ? savedComment : comment);
    await this.todoRepository.save(todo);
    this.createTodoLog({
      oldValue: oldContent,
      newValue: data.content,
      action: 'update',
      userId,
      todoId,
    });
    return savedComment;
  }

  async delete(commentId: string, userId: number) {
    const comment = await this.repository.findOne(
      { where: { id: commentId }, relations: ['todo'] }
    );
    if (!comment) {
      throw new Error('Comment not found');
    }
    const todo = await this.todoRepository.findOne(
      { where: { id: comment.todo.id }, relations: ['comments'] }
    );
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.comments = todo.comments.filter((comment: any) => comment.id !== commentId);
    await this.todoRepository.save(todo);
    const deletedComment = await this.repository.delete(commentId);
    this.createTodoLog({
      oldValue: comment.content,
      newValue: '',
      action: 'delete',
      userId,
      todoId: todo.id,
    });
    return deletedComment;
  }

  async getCommentsByTodoId(todoId: number) {
    const comments = await this.repository.find(
      { where: { todo: { id: todoId } }, relations: ['user'] }
    );
    return comments;
  }
}

export default new TodoCommentService();
