import { User } from "@/common/user";
import { TodoItem } from "@/types/todo";

export interface ProjectItem {
  projectName: string,
  projectId?: string,
  members: User[],
  todos?: TodoItem[],
}

export interface ProjectItemDetails extends ProjectItem {};
