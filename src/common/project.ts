import { TodoItem } from "./type";

export interface ProjectItem {
  projectName: string,
  projectId: string,
  members: string[],
  todos?: TodoItem[],
}

export interface ProjectItemDetails extends ProjectItem {};
