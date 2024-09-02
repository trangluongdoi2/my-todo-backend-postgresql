import { Router } from "express";
import UserController from "@/controller/user.controller";
import AuthMiddleware from "@/middleware/auth.middleware";

const router = Router();
router.get('/auth', UserController.getAllUsers);
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);
router.post('/auth/logout', AuthMiddleware.authentication, UserController.logout);
router.get('/auth/refresh-token/:id', AuthMiddleware.authentication, UserController.getRefreshToken);
export default router;