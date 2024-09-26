import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import { ProjectItem } from '@/common/project';
import ProjectService from '@/services/project.service';
import { catchAsync } from '@/utils/catchAsync';
import httpStatus from 'http-status';
import { pick } from '@/utils/pick';
class ProjectController {
  // async getProjects(req: Request, res: Response) {
  //   const data = await ProjectService.getProjects();
  //   res.status(data.status).json({
  //     message: data.message,
  //     data: data.data
  //   });
  // }

  getProjects = catchAsync(async (req: Request, res: Response) => {
    const projects = await ProjectService.getProjects();
    res.status(httpStatus.OK).send(projects);
  });

  getProjectById = catchAsync(async (req: Request, res: Response) => {
    // const { id = '' } = req.params;
    const { id } = pick(req.params, ['id']);
    console.log(id, 'id...');
    const project = await ProjectService.getProjectById(Number(id));
    if (!project) {
      res.status(httpStatus.NOT_FOUND).send('Project not found');
    }
    res.status(httpStatus.OK).send(project);
    // res.status(data.status).json({
    //   message: data.message,
    //   data: data.data
    // });
  });

  // async getProjectById(req: Request, res: Response) {
  //   const { id = '' } = req.params;
  //   const data = await ProjectService.getProjectById(Number(id));
  //   res.status(data.status).json({
  //     message: data.message,
  //     data: data.data
  //   });
  // }

  async getProjectByUserId(req: Request, res: Response) {
    // const { userId = '' } = req.params;
    const { userId } = pick(req.params, ['userId']);
    console.log(userId, 'userId...');
    const data = await ProjectService.getProjectsByUserId(Number(userId));
    res.status(data.status).json({
      message: data.message,
      data: data.data
    });
  }

  async deleteProject(req: Request, res: Response) {
    const { id = '' } = req.params;
    const data = await ProjectService.deleteProjectById(Number(id));
    res.status(data?.status).send(data?.message);
  }
  
  async getMembersById(req: Request, res: Response) {
    const { projectId = '' } = req.params;
    const data = await ProjectService.getMembersById(Number(projectId));
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
