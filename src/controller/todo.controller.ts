import { Request, Response } from "express";
import TodoService from "@/services/todo.service";
import UploadS3Service from '@/services/upload.service';

class TodoController {
  async getTodos(req: Request, res: Response) {
    const data = await TodoService.getTodos();
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async getTodoById(req: Request, res: Response) {
    const data = await TodoService.getTodoById(Number(req.params.id));
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async getTodosListByProjectId(req: Request, res: Response) {
    const data = await TodoService.getTodosListByProjectId(Number(req.params.projectId));
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async createTodo(req: Request, res: Response) {
    const data = await TodoService.createTodo(req.body);
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }
  
  async updateTodo(req: Request, res: Response) {
    const data = await TodoService.updateTodo(req.body as any);
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async updateTodoByField(req: Request, res: Response) {
    const { id } = req.params;
    const { field, value } = req.body;
    const input = {
      id,
      field,
      value,
    }
    const data = await TodoService.updateTodoByField(input);
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async uploadImages(req: Request, res: Response) {
    const id = req.body.id || '';
    const uploadedFiles = await UploadS3Service.handle((req?.files as any) || []);
    if (!uploadedFiles.length) {
      res.status(500).send('Uploaded Failed!');
      return;
    }
    const data = await TodoService.updateAttachments({ id, files: uploadedFiles });
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async downloadImage(req: Request, res: Response) {
    const key = req.params.key || '';
    const data = await UploadS3Service.getObject(key);
    if (!data) {
      res.status(500);
    } else {
      res.status(200).json({
        message: 'Download successfully!',
        data: data
      });
    }
  }

  async deleteTodo(req: Request, res: Response) {
    const data = await TodoService.deleteTodo(Number(req.params.id));
    res.status(data.status).send(data.message);
  }
}

export const todoController = new TodoController();

