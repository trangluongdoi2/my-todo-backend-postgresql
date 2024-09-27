import { User } from "@/common/user";
import { TodoItem } from "./type";

export interface ProjectItem {
  projectName: string,
  projectId?: string,
  members: User[],
  todos?: TodoItem[],
}

export interface ProjectItemDetails extends ProjectItem {};
