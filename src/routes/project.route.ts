import { Router } from "express";
import ProjectController from '@/controller/project.controller';

const router = Router();
router.get('/project', ProjectController.getProjectsList);
router.get('/project/:id', ProjectController.getProjectById);
router.post('/project/create', ProjectController.createProject);

export default router;