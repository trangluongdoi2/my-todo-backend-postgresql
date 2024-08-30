export interface ProjectItem {
  projectName: string,
  projectId: string,
  members: string[],
  todoItems: string[],
}

export interface ProjectItemDetails extends ProjectItem {};
