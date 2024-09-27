import { Router } from "express";
import ProjectController from '@/controller/project.controller';
import AuthMiddleware from "@/middleware/auth.middleware";

const router = Router();
router.get('/projects', AuthMiddleware.authentication, ProjectController.getProjects);
router.get('/projects/:id', AuthMiddleware.authentication, ProjectController.getProjectById);
router.get('/projects-list/:userId', AuthMiddleware.authentication, ProjectController.getProjectByUserId);
router.post('/projects/create', AuthMiddleware.authentication, ProjectController.createProject);
router.delete('/projects/delete/:id', AuthMiddleware.authentication, ProjectController.deleteProject);
router.get('/projects/members-list/:projectId', AuthMiddleware.authentication, ProjectController.getMembersById);
router.post('/projects/send-invite-mail/:projectId', ProjectController.sendInviteMailToAddMember);

export default router;