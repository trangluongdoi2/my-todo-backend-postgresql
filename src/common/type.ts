export enum TodoStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN PROGRESS",
  DONE = "DONE"
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  HIGHEST = 'HIGHEST',
}

export interface TodoItem {
  todoName: string,
  todoId: string,
  title: string,
  todoStatus: TodoStatus,
  projects?: string[],
  label: string,
  description: string,
  priority: Priority,
  assignee?: string[],
}

export interface TodoItemDetails extends TodoItem {
  id: string,
  attachments?: Array<{ id: string, filePath: string }>,
}