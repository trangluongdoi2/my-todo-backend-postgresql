import { setSeederFactory } from 'typeorm-extension';
import { Todo } from '@/entity/todo.entity';
import { TodoStatusLog } from '@/entity/todo_status_log.entity';
import { TodoStatus } from '@/types/todo';

export const TodoFactory = setSeederFactory(Todo, async () => {
  const todo = new Todo();
  const randomNumber = Number(Math.floor(Math.random() * 1000000).toString());
  const randomTitle = `Title-${randomNumber}`;
  const randomName = `Name-${randomNumber}`;
  const randomLabel = `Label-${randomNumber}`;
  todo.title = randomTitle;
  todo.todoName = randomName;
  todo.label = randomLabel;
  todo.description = 'Description';
  if (randomNumber % 3 === 0) {
    todo.todoStatus = TodoStatus.IN_PROGRESS;
  } else if (randomNumber % 3 === 1) {
    todo.todoStatus = TodoStatus.PENDING;
  } else {
    todo.todoStatus = TodoStatus.DONE;
  }
  const statusLog = new TodoStatusLog();
  statusLog.oldValue = '';
  statusLog.newValue = '';
  statusLog.field = '';
  statusLog.action = 'create';
  todo.statusLogs = [statusLog];
  return todo;
});
