import { Request, Response } from "express";
import { pick } from "@/utils/pick";
import TodoService from "@/services/todo.service";
import UploadS3Service from '@/services/upload.service';
import { catchAsync } from '@/utils/catchAsync';
import Encrypt from '@/helpers/encrypt';
import httpStatus from 'http-status';
import TodoCommentService from "@/services/todo-comment.service";

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

  uploadAttachmentByVideos = catchAsync(async (req: Request, res: Response) => {
    const { id, projectId } = pick(req.body, ['id', 'projectId']);
    const uploadedFiles = await UploadS3Service.handleUploadVideo(projectId, (req?.files as any) || []);
    if (!uploadedFiles?.length) {
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

  uploadAttachments = catchAsync(async (req: Request, res: Response) => {
    const { id, projectId } = pick(req.body, ['id', 'projectId']);
    const uploadedFiles = req.files as any;
    const { videos = [], images = [] } = uploadedFiles;
    const uploadedVideos = await UploadS3Service.handleUploadVideo(projectId, videos);
    const uploadedImages = await UploadS3Service.handleUploadImage(projectId, images);
    console.log(uploadedVideos, uploadedImages, '==> uploadedVideos, uploadedImages...');
    if (!uploadedVideos?.length && !uploadedImages?.length) {
      res.status(httpStatus.EXPECTATION_FAILED).send({
        message: 'Upload failed!',
      });
      return;
    }
    const data = await TodoService.updateAttachments({ id, files: [...uploadedVideos, ...uploadedImages] });
    res.status(httpStatus.OK).send({
      message: 'Upload successfully!',
      data,
    });
  });

  uploadAttachmentByImages = catchAsync(async (req: Request, res: Response) => {
    const { id, projectId } = pick(req.body, ['id', 'projectId']);
    const uploadedFiles = await UploadS3Service.handleUploadImage(projectId, (req?.files as any) || []);
    if (!uploadedFiles?.length) {
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
    const { key = '' } = pick(req.params, ['key']);
    const { projectId } = pick(req.query, ['projectId']);
    const data = await UploadS3Service.getObject({ key, projectId });
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

  createTodoComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);
    const data = await TodoCommentService.create(Number(id), req.body);
    res.status(httpStatus.CREATED).send({
      message: 'Create todo comment successfully!',
      data,
    });
  });

  updateTodoComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);
    const data = await TodoCommentService.update(id, req.body);
    res.status(httpStatus.OK).send({
      message: 'Update todo comment successfully!',
      data,
    });
  });

  deleteTodoComment = catchAsync(async (req: Request, res: Response) => {
    const { commentId } = pick(req.params, ['commentId']);
    const token = req.headers.authorization?.split(' ')[1] as string;
    const getInfoFromToken = Encrypt.getInfoFromToken(token) as { id: number };
    const data = await TodoCommentService.delete(commentId, getInfoFromToken.id);
    res.status(httpStatus.OK).send({
      message: 'Delete todo comment successfully!',
      data,
    });
  });

  getLogsByTodoId = catchAsync(async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);
    const data = await TodoService.getLogsByTodoId(Number(id));
    res.status(httpStatus.OK).send({
      message: 'Get logs successfully!',
      data,
    });
  });
}

export const todoController = new TodoController();
