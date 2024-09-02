import { TodoItem, TodoItemDetails, TodoStatus, Priority } from '@/common/type';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { Todo } from '@/entity/todo.entity';
import { Repository } from 'typeorm';

class TodoService {
  private entity: Repository<Todo>;
  constructor() {
    this.entity = AppDataSource.getRepository(Todo);
  }
  async getTodoList() {
    try {
      const res = await this.entity.find();
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
      const res = await this.entity.findOneBy({ id: id as number });
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

  async createTodo(input: TodoItem) {
    try {
      const res = await this.entity.save(input);
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
    const todoNeedUpdate = await this.entity.findOneBy({ id: id as any });
    await this.entity.save(todoNeedUpdate as any);
    return {
      status: 500,
      message: 'Todo update failed',
      data: null,
    }
  }

  async updateTodoByField(input: { id: string , field: string, value: any }) {
    try {
      const { id, field, value } = input;
      const todoNeedUpdate = await this.entity.findOneBy({ id: id as any });
      let newUpdateTodo;
      if (todoNeedUpdate) {
        newUpdateTodo = { 
          ...todoNeedUpdate,
          [field]: value,
        }
      }
      const res = await this.entity.save(newUpdateTodo as any);
      return {
        status: 200,
        message: `Update ${field} for todo sucessfully!`,
        data: res,
      }
    } catch (error) {
      console.log(error);
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

  // async updateProjectsInTodo(input: { id: string, projectId: string | number }) {
  //   console.log(input, 'updateProjectsInTodo..');
  // }

  async deleteTodo(id: number) {
    try {
      await this.entity.delete({ id: id });
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