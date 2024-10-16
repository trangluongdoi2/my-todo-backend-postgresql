import jade from 'jade';
import fs from 'fs';
import path from 'path';
import httpStatus from 'http-status';
import { Repository } from 'typeorm';
import { ProjectItem } from '@/common/project';
import { AppDataSource } from '@/config/db-connection';
import config from '@/config';
import ApiError from '@/utils/apiError';
import { Project } from '@/entity/project.entity';
import { Todo } from '@/entity/todo.entity';
import { User } from '@/entity/user.entity';
import MailService from './mail.service';
import TodoService from './todo.service';
class ProjectService {
  private repository: Repository<Project>;
  private userRepository: Repository<User>;
  private todoRepository: Repository<Todo>;
  constructor() {
    this.repository = AppDataSource.getRepository(Project);
    this.userRepository = AppDataSource.getRepository(User);
    this.todoRepository = AppDataSource.getRepository(Todo);
  }

  async createProject(input: ProjectItem) {
    const { members = [] } = input;
    const userId = members[0];
    const user = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: {
        projects: true,
      }
    });
    if (!user) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Create project failed!');
    }
    const res = await this.repository.save({ ...input });
    user.projects = [...user.projects || [], res];
    await this.userRepository.save(user);
    return res;
  }

  async getProjects() {
    const projects = await this.repository.find();
    return projects;
  }

  async getProjectById(id: number) {
    const project = await this.repository.findOne({ where: { id } });
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    return project;
  }

  async deleteProjectById(id: number) {
    const project = await this.repository.findOne({
      where: { id },
      relations: { todos: true },
    });
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    const { todos = [] } = project;
    await Promise.all(todos.map((todo: Todo) => {
      TodoService.deleteTodo(todo.id);
    }));
    project.todos = [];
    await this.repository.save(project);
    await this.repository.delete(id);
    return project;
    // const project = await this.repository.createQueryBuilder('project')
    //   .leftJoinAndSelect('project.todos', 'todo')
    //   .leftJoinAndSelect('todo.statusLogs', 'statusLog')
    //   .leftJoinAndSelect('todo.attachments', 'attachment')
    //   .leftJoinAndSelect('todo.comments', 'comment')
    //   .where('project.id = todo.projectId')
    //   .delete()
    //   .execute();
    // console.log(project, '==> project...');
    // return project;
  }

  async getProjectsByUserId(userId: number) {
    const project = await this.repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'member')
      .where('member.id = :userId', { userId })
      .leftJoinAndSelect('project.todos', 'todo')
      .getMany();
    return project;
  }

  async getMembersById(id: number) {
    const project = await this.repository.findOne({
      where: { id },
      relations: { members: true },
    });
    const { members = [] } = project as unknown as ProjectItem;
    return members;
  }

  async sentInviteMailToAddMember(input: { fromEmail: string, destEmail: string, projectId: number }) {
    const { fromEmail = '', destEmail = '', projectId } = input;
    const data = await this.getProjectById(projectId) as any;
    const user = await this.getMemberByEmail(destEmail);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const pathTemplate = path.resolve(__dirname, '../views/templateEmail.jade');
    const fnTemplate = jade.compile(fs.readFileSync(pathTemplate, { encoding: 'utf-8' }));
    const info = {
      host: config.host,
      fromEmail,
      destEmail,
      projectInfos: {
        id: projectId,
        name: data.projectName,
      },
      memberInfos: {
        name: user?.username,
      }
    }
    const html = fnTemplate(info);
    const transporter = MailService.transporter;
    const mainOptions = {
      from: fromEmail,
      to: destEmail,
      subject: 'noreply@gmail.com',
      text: `You recieved message from ${fromEmail}`,
      html,
    };
    transporter.sendMail(mainOptions, (err: any, info: any) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  }

  async getMemberByEmail(email: string) {
    const res = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: {
        projects: true,
      }
    });
    return res;
  }

  async addMember(input: any) {
    const { email = '', projectId } = input;
    const user = await this.getMemberByEmail(email);
    const project = await this.repository.findOne({
      where: {
        id: projectId,
      },
      relations: {
        members: true,
      }
    });
    if (!project || !user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Add member failed!');
    }
    if (project && user) {
      project.members = [...project.members, user];
      const newProject = await this.repository.save(project);
      return newProject;
    }
  }
}

export default new ProjectService();