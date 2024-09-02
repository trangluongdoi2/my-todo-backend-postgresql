import { ProjectItem } from '@/common/project';
import { AppDataSource } from '@/config/db-connection';
import { Project } from '@/entity/project.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

class ProjectService {
  private entity: Repository<ProjectItem>;
  constructor() {
    this.entity = AppDataSource.getRepository(Project);
  }

  async createProject(input: ProjectItem) {
    try {
      const res = await this.entity.save({
        ...input,
        projectId: uuidv4(),
      });
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
      const res = await this.entity.find();
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
    console.log(id, 'id..');
    try {
      const res = await this.entity.findOne({
        where: {
          projectId: id,
        },
        relations: {
          todos: true,
        }
      });
      console.log(res, 'res...');
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
}

export default new ProjectService();