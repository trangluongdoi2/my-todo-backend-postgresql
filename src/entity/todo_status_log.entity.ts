import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Todo } from './todo.entity';
import { TodoItem } from '@/types/todo';
import { User } from './user.entity';

export type FieldTodoItem = keyof TodoItem | 'comment';

@Entity()
export class TodoStatusLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  oldValue: string;

  @Column()
  newValue: string;

  @Column()
  field: FieldTodoItem;

  @Column({ type: 'enum', enum: ['create', 'update', 'delete'] })
  action: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @ManyToOne(() => Todo, (todo: any) => todo.statusLogs)
  todo: Todo;

  @ManyToOne(() => User, (user) => user)
  user: User;
}