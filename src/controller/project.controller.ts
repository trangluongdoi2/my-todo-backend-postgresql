import { Request, Response } from 'express';
import { ProjectItem } from '@/common/project';
import ProjectService from '@/services/project.service';
import { catchAsync } from '@/utils/catchAsync';
import httpStatus from 'http-status';
import { pick } from '@/utils/pick';
class ProjectController {
  getProjects = catchAsync(async (req: Request, res: Response) => {
    const projects = await ProjectService.getProjects();
    res.status(httpStatus.OK).send(projects);
  });

  getProjectById = catchAsync(async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);
    const project = await ProjectService.getProjectById(Number(id));
    res.status(httpStatus.OK).send({
      message: 'Get project successfully',
      data: project
    });
  });

  getProjectByUserId = catchAsync(async (req: Request, res: Response) => {
    const { userId } = pick(req.params, ['userId']);
    const projects = await ProjectService.getProjectsByUserId(Number(userId));
    res.status(httpStatus.OK).send({
      message: 'Get project successfully',
      data: projects
    });
  });

  createProject = catchAsync(async (req: Request, res: Response) => {
    const input: ProjectItem = { ...req.body }
    const newProject = await ProjectService.createProject(input);
    res.status(httpStatus.OK).send({
      message: 'Create project successfully',
      data: newProject
    });
  });

  updateProjectWithAttributes = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.NOT_IMPLEMENTED).send({
      message: 'Update project successfully',
      data: [],
    });
  });

  deleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);
    const deletedProject = await ProjectService.deleteProjectById(Number(id));
    res.status(httpStatus.OK).send({
      message: 'Delete project successfully',
      data: deletedProject
    });
  });

  getMembersById = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = pick(req.params, ['projectId']);
    const data = await ProjectService.getMembersById(Number(projectId));
    res.status(httpStatus.OK).send({
      message: 'Get members successfully',
      data,
    });
  });

  sendInviteMailToAddMember = catchAsync(async (req: Request, res: Response) => {
    const { fromEmail, destEmail } = pick(req.body, ['fromEmail', 'destEmail']);
    const { projectId } = pick(req.params, ['projectId']);
    const data = await ProjectService.sentInviteMailToAddMember({ fromEmail, destEmail, projectId: Number(projectId) });
    res.status(httpStatus.OK).json({
      message: 'Sent invite mail successfully',
      data,
    });
  });

  addMember = catchAsync(async (req: Request, res: Response) => {
    const { email, projectId } = pick(req.body, ['email', 'projectId']);
    const newProject = await ProjectService.addMember({ email, projectId });
    res.status(httpStatus.OK).send({
      message: 'Add member successfully',
      data: newProject
    });
  });

  removeMember = catchAsync(async (req: Request, res: Response) => {
    console.log('removeMember...');
    res.status(httpStatus.OK).send({
      message: 'Remove member successfully',
      data: [],
    });
  });
}

export default new ProjectController();
