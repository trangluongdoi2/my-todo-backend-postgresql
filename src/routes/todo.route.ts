import { Router } from "express";
import multer from "multer";
import { todoController } from "@/controller/todo.controller";
import AuthMiddleWare from "@/middleware/auth.middleware";
import { pick } from "@/utils/pick";
import { getExtensionFile } from "@/common/file";

const cbFileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const newFileName = pick(req.body, ['newFileName']);
  const extension = getExtensionFile(file.originalname);
  file.originalname = (newFileName || Math.random().toString(36).substring(2, 15)) + extension;
  cb(null, true);
};

const uploadMiddleWare = multer({ fileFilter: cbFileFilter as any });

const router = Router();
router.get('/todo', AuthMiddleWare.authentication, todoController.getTodos);
router.get('/todo/:id', AuthMiddleWare.authentication, todoController.getTodoById);
router.get('/todo-list/:projectId', AuthMiddleWare.authentication, todoController.getTodosByProjectId);
router.post('/todo/create', AuthMiddleWare.authentication, todoController.createTodo);
router.put('/todo/update/:id', AuthMiddleWare.authentication, todoController.updateTodo);
router.put('/todo/update-field/:id', AuthMiddleWare.authentication, todoController.updateTodoByField);
router.delete('/todo/delete/:id', AuthMiddleWare.authentication, todoController.deleteTodo);

router.get('/todo/logs/:id', AuthMiddleWare.authentication, todoController.getLogsByTodoId);

router.post('/todo/add-comment/:id', AuthMiddleWare.authentication, todoController.createTodoComment);
router.put('/todo/update-comment/:commentId', AuthMiddleWare.authentication, todoController.updateTodoComment);
router.delete('/todo/delete-comment/:commentId', AuthMiddleWare.authentication, todoController.deleteTodoComment);

router.post('/todo/upload/:id', AuthMiddleWare.authentication,
  uploadMiddleWare.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 10 },
  ]),
  todoController.uploadAttachments,
);
router.get('/todo/download/:key', AuthMiddleWare.authentication, todoController.downloadImage);

export default router;
