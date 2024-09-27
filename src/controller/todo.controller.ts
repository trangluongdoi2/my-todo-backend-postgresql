import { Request, Response } from "express";
import TodoService from "@/services/todo.service";
import UploadS3Service from '@/services/upload.service';
import { catchAsync } from '@/utils/catchAsync';
import httpStatus from 'http-status';

class TodoController {
  getTodos = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.getTodos();
    res.status(httpStatus.OK).json({
      message: '',
      data,
    });
  });

  getTodoById = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.getTodoById(Number(req.params.id));
    res.status(httpStatus.OK).json({
      message: 'Get todo successfully!',
      data,
    });
  });

  getTodosByProjectId = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.getTodosByProjectId(Number(req.params.projectId));
    res.status(httpStatus.OK).json({
      message: 'Get todos successfully!',
      data,
    });
  });

  createTodo = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.createTodo(req.body);
    res.status(httpStatus.CREATED).json({
      message: 'Create todo successfully!',
      data,
    });
  });
  
  updateTodo = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.updateTodo(req.body as any);
    res.status(httpStatus.OK).json({
      message: 'Update todo successfully!',
      data,
    });
  });

  updateTodoByField = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { field, value } = req.body;
    const input = {
      id,
      field,
      value,
    }
    const data = await TodoService.updateTodoByField(input);
    res.status(httpStatus.OK).json({
      message: 'Update todo successfully!',
      data,
    });
  });

  uploadImages = catchAsync(async (req: Request, res: Response) => {
    const id = req.body.id || '';
    const uploadedFiles = await UploadS3Service.handle((req?.files as any) || []);
    if (!uploadedFiles.length) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Upload Failed!');
      return;
    }
    const data = await TodoService.updateAttachments({ id, files: uploadedFiles });
    res.status(httpStatus.OK).json({
      message: 'Upload successfully!',
      data,
    });
  });

  downloadImage = catchAsync(async (req: Request, res: Response) => {
    const key = req.params.key || '';
    const data = await UploadS3Service.getObject(key);
    if (!data) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Download Failed!');
    } else {
      res.status(httpStatus.OK).json({
        message: 'Download successfully!',
        data,
      });
    }
  });

  deleteTodo = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.deleteTodo(Number(req.params.id));
    res.status(httpStatus.OK).json({
      message: 'Delete todo successfully!',
      data,
    });
  });
}

export const todoController = new TodoController();
