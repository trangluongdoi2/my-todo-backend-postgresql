export enum TodoStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  HIGHEST = 'HIGHEST',
}
export interface TodoItemInput {
  projects: string[],
  todoName: string,
  todoStatus?: TodoStatus,
  label: string,
  tag?: string,
  description: string,
  priority: Priority,
  title: string,
  assignee?: string[],
}

export interface TodoItemDetails extends TodoItemInput {
  id: string,
  attachments?: Array<{ id: string, filePath: string }>,
}