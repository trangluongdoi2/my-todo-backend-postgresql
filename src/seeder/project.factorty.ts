import { setSeederFactory } from "typeorm-extension";
import { Project } from "@/entity/project.entity";

export const ProjectFactory = setSeederFactory(Project, async () => {
  const project = new Project();
  project.projectName = 'Project 1';
  return project;
});