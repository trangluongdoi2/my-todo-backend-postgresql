import { ProjectItem } from '@/common/project';
import ProjectService from '@/services/project.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
class ProjectController {
  async getProjectsList(req: Request, res: Response) {
    const data = await ProjectService.getProjectsList();
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async getProjectById(req: Request, res: Response) {
    const { id = '' } = req.params;
    const data = await ProjectService.getProjectById(id);
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async getProjectByUserId(req: Request, res: Response) {
    const { userId = '' } = req.params;
    const data = await ProjectService.getProjectsListByUserId(Number(userId));
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async createProject(req: Request, res: Response) {
    const input: ProjectItem = {
      ...req.body,
      projectId: uuidv4(),
    }
    const data = await ProjectService.createProject(input);
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }
}

export default new ProjectController();
