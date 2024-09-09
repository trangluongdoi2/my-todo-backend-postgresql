import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import { ProjectItem } from '@/common/project';
import ProjectService from '@/services/project.service';
class ProjectController {
  async getProjectsList(req: Request, res: Response) {
    console.log('getProjectsList...');
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
  
  async getMembersById(req: Request, res: Response) {
    const { projectId = '' } = req.params;
    // console.log(projectId, 'getMembersById...');
    const data = await ProjectService.getMembersById(Number(projectId));
    console.log(data, 'data...');
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async sentInviteMailToAddMember(req: Request, res: Response) {
    const { fromEmail = '', destEmail = '' } = req.body;
    const { projectId = '' } = req.params;
    const data = await ProjectService.sentInviteMailToAddMember({ fromEmail, destEmail, projectId: Number(projectId) });
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async addMember(req: Request, res: Response) {
    const { email = '', projectId } = req.body;
    const data = await ProjectService.addMember({ email, projectId });
    res.status(200).send(data.message);
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
