import { Router } from "express";
import multer from "multer";
import { todoController } from "@/controller/todo.controller";
import AuthMiddleWare from "@/middleware/auth.middleware";

const uploadMiddleWare = multer();
const router = Router();
router.get('/todo', AuthMiddleWare.authentication, todoController.getTodos);
router.get('/todo/:id', AuthMiddleWare.authentication, todoController.getTodoById);
router.get('/todo-list/:projectId', AuthMiddleWare.authentication, todoController.getTodosByProjectId);
router.post('/todo/create', AuthMiddleWare.authentication, todoController.createTodo);
router.put('/todo/update/:id', AuthMiddleWare.authentication, todoController.updateTodo);
router.put('/todo/update-field/:id', AuthMiddleWare.authentication, todoController.updateTodoByField);
router.delete('/todo/delete/:id', AuthMiddleWare.authentication, todoController.deleteTodo);
router.post('/todo/upload/:id', AuthMiddleWare.authentication, uploadMiddleWare.array('images'), todoController.uploadImages);
router.get('/todo/download/:key', AuthMiddleWare.authentication, todoController.downloadImage);

export default router;
