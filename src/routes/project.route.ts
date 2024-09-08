import { Router } from "express";
import ProjectController from '@/controller/project.controller';
import AuthMiddleware from "@/middleware/auth.middleware";

const router = Router();
router.get('/projects', AuthMiddleware.authentication, AuthMiddleware.authorization, ProjectController.getProjectsList);
router.get('/projects/:id', AuthMiddleware.authentication, ProjectController.getProjectById);
router.get('/projects-list/:userId', AuthMiddleware.authentication, ProjectController.getProjectByUserId);
router.post('/projects/create', AuthMiddleware.authentication, ProjectController.createProject);
// router.post('/projects/create', ProjectController.createProject);

export default router;