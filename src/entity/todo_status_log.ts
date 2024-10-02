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

export type FieldTodoItem = keyof TodoItem;

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

  @Column({ type: 'enum', enum: ['create', 'update'] })
  action: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createAt: Date;

  @ManyToOne(() => Todo, (todo: any) => todo.statusLogs)
  todo: string;

  @ManyToOne(() => User, (user) => user)
  user: User;
}