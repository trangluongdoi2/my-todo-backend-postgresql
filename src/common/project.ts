export interface ProjectItem {
  projectName: string,
  projectId: string,
  members: string[],
  todos?: string[],
}

export interface ProjectItemDetails extends ProjectItem {};
