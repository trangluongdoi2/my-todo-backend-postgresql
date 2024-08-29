import { v4 as uuidv4 } from 'uuid';
import { TodoItemDetails, TodoItemInput } from '@/type';
import pool from '@/config/database';

class TodoService {
  async getTodoList() {
    try {
      const queryStream = `SELECT * FROM todo_items;`;
      pool.query(queryStream, (error, results) => {
        if (error) {
          throw error
        }
        console.log(results.rows, 'results.rows...');
      })
    } catch (error) {
    }
    return {
      status: 200,
      message: "Todo list fetched successfully",
      data: [],
    }
  }

  async getTodoItemDetails(id: string) {
    return {
      status: 500,
      message: "Todo list fetched failed",
      data: null, 
    }
  }

  async queryTodoList(query?: Record<string, any>) {
    console.log(query, 'query...');
    return {
      status: 200,
      message: 'queryTodoList',
      data: [],
    }
  }

  async createTodo(input: TodoItemInput) {
    return {
      status: 500,
      message: 'Todo created failed',
      data: null,
    }
  }

  async updateTodo(input: TodoItemDetails) {
    return {
      status: 500,
      message: 'Todo update failed',
      data: null,
    }
  }

  async updateAtrributeTodo<T>(input: { id: string, field: string, value: T }) {
    return {
      status: 500,
      message: 'Todo update failed',
      data: null,
    }
  }

  async updateAttachments(input: { id: string, files: any[] }) {
    return {
      status: 500,
      message: 'Todo update failed',
      data: null,
    }
  }

  async deleteTodo(id: string) {
    return {
      status: 500,
      message: "Todo deleted failed!"
    }
  }
}

export default new TodoService();