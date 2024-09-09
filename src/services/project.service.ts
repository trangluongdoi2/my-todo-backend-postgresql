import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProjectItem } from '@/common/project';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { User } from '@/entity/user.entity';
import MailService from './mail.service';
import jade from 'jade';
import fs from 'fs';
import path from 'path';

class ProjectService {
  private repository: Repository<Project>;
  private userRepository: Repository<User>;
  constructor() {
    this.repository = AppDataSource.getRepository(Project);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createProject(input: ProjectItem) {
    try {
      const { members = [] } = input;
      const userId = members[0];
      const user = await this.userRepository.findOne(
        {
          where: {
            id: Number(userId),
          },
          relations: {
            projects: true,
          }
        }
      );
      const res = await this.repository.save({
        ...input,
        projectId: uuidv4(),
      });

      if (user) {
        user.projects = [...user.projects || [], res];
        await this.userRepository.save(user);
      }
      return {
        status: 200,
        message: "Create project successfully",
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
        data: [],
      }
    }
  }

  async getProjectsList() {
    try {
      const res = await this.repository.find();
      return {
        status: 200,
        message: "Todo list fetched successfully",
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
        data: [],
      }
    }
  }

  async getProjectById(id: any) {
    try {
      const res = await this.repository.findOne({
        where: {
          id,
        },
      });
      return {
        status: 200,
        message: "Todo list fetched successfully",
        data: res,
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
        data: [],
      }
    }
  }

  async getProjectsListByUserId(userId: number) {
    try {
      const res = await this.repository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('member.id = :userId', { userId })
        .leftJoinAndSelect('project.todos', 'todo')
        .getMany();
      return {
        status: 200,
        message: 'Noooo',
        data: res,
      }
    } catch (error) {
      console.log(error, 'error...');
      return {
        status: 500,
        message: error,
        data: [],
      }
    }
  }

  async getMembersById(id: number) {
    try {
      const res = await this.repository.findOne({
        where: {
          id,
        },
        relations: {
          members: true,
        }
      });
      const { members = [] } = res as unknown as ProjectItem;
      return {
        status: 200,
        message: 'oke',
        data: members,
      }
    } catch (error) {
      console.log(error, 'error...');
      return {
        status: 500,
        message: error,
        data: [],
      }
    }
  }

  async sentInviteMailToAddMember(input: { fromEmail: string, destEmail: string, projectId: number }) {
    const { fromEmail = '', destEmail = '', projectId } = input;
    const { data } = await this.getProjectById(projectId) as any;
    const user = await this.getMemberByEmail(destEmail);
    const pathTemplate = path.resolve(__dirname, '../views/templateEmail.jade');
    const fnTemplate = jade.compile(fs.readFileSync(pathTemplate, { encoding: 'utf-8' }));
    const info = {
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
    try {
      transporter.sendMail(mainOptions, (err: any, info: any) => {
        if (err) {
          console.log(err);
          return false;
        } else {
          // console.log(info, 'info...');
          return true;
        }
      });
    } catch (error) {
      console.log(error, 'error...');
    }
    return {
      status: 500,
      message: '',
      data: '',
    }
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
    try {
      const user = await this.getMemberByEmail(email);
      const project = await this.repository.findOne({
        where: {
          id: projectId,
        },
        relations: {
          members: true,
        }
      })
      if (project && user) {
        project.members = [...project.members, user];
        this.repository.save(project);
      }
      return {
        status: 200,
        message: 'Add member successfully!',
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Add member failed!',
      }
    }
    
  }
}

export default new ProjectService();