import { Request, Response } from "express";
import TodoService from "@/services/todo.service";
import UploadS3Service from '@/services/upload.service';
import { catchAsync } from '@/utils/catchAsync';
import Encrypt from '@/helpers/encrypt';
import httpStatus from 'http-status';

class TodoController {
  getTodos = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.getTodos();
    res.status(httpStatus.OK).send({
      message: '',
      data,
    });
  });

  getTodoById = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.getTodoById(Number(req.params.id));
    res.status(httpStatus.OK).send({
      message: 'Get todo successfully!',
      data,
    });
  });

  getTodosByProjectId = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.getTodosByProjectId(Number(req.params.projectId));
    res.status(httpStatus.OK).send({
      message: 'Get todos successfully!',
      data,
    });
  });

  createTodo = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1] as string;
    const getInfoFromToken = Encrypt.getInfoFromToken(token) as { userId: number };
    const newTodo = await TodoService.createTodo(getInfoFromToken.userId, req.body);
    res.status(httpStatus.CREATED).send({
      message: 'Create todo successfully!',
      data: newTodo,
    });
  });
  
  updateTodo = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.updateTodo(req.body as any);
    res.status(httpStatus.OK).send({
      message: 'Update todo successfully!',
      data,
    });
  });

  updateTodoByField = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1] as string;
    const getInfoFromToken = Encrypt.getInfoFromToken(token) as { userId: number };
    const { id } = req.params;
    const { field, value } = req.body;
    const input = {
      id,
      field,
      value,
    }
    const data = await TodoService.updateTodoByField(getInfoFromToken.userId, input);
    res.status(httpStatus.OK).send({
      message: 'Update todo successfully!',
      data,
    });
  });

  uploadImages = catchAsync(async (req: Request, res: Response) => {
    const id = req.body.id || '';
    const uploadedFiles = await UploadS3Service.handle((req?.files as any) || []);
    if (!uploadedFiles.length) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Upload failed!',
      });
      return;
    }
    const data = await TodoService.updateAttachments({ id, files: uploadedFiles });
    res.status(httpStatus.OK).send({
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
      res.status(httpStatus.OK).send({
        message: 'Download successfully!',
        data,
      });
    }
  });

  deleteTodo = catchAsync(async (req: Request, res: Response) => {
    const data = await TodoService.deleteTodo(Number(req.params.id));
    res.status(httpStatus.OK).send({
      message: 'Delete todo successfully!',
      data,
    });
  });
}

export const todoController = new TodoController();
