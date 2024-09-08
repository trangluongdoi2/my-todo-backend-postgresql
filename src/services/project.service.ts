import { ProjectItem } from '@/common/project';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { User } from '@/entity/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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
}

export default new ProjectService();