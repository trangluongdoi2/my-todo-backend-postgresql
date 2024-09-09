import { Router } from "express";
import ProjectController from '@/controller/project.controller';
import AuthMiddleware from "@/middleware/auth.middleware";

const router = Router();
router.get('/projects', AuthMiddleware.authentication, AuthMiddleware.authorization, ProjectController.getProjectsList);
router.get('/projects/:id', AuthMiddleware.authentication, ProjectController.getProjectById);
router.get('/projects-list/:userId', AuthMiddleware.authentication, ProjectController.getProjectByUserId);
router.post('/projects/create', AuthMiddleware.authentication, ProjectController.createProject);
// router.get('/projects/:projectId/members-list', AuthMiddleware.authentication, ProjectController.getMembersById);
router.get('/projects/members-list/:projectId', AuthMiddleware.authentication, ProjectController.getMembersById);
// router.post('/projects/send-invite-mail/:projectId', AuthMiddleware.authentication, ProjectController.sentInviteMailToAddMember);
router.post('/projects/send-invite-mail/:projectId', ProjectController.sentInviteMailToAddMember);
router.post('/projects/add-member', ProjectController.addMember);

export default router;