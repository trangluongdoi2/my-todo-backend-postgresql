import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Todo } from './todo.entity';
import { User } from './user.entity';

@Entity()
export class TodoComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @ManyToOne(() => Todo, (todo: any) => todo.comments)
  todo: Todo;

  @ManyToOne(() => User, (user) => user)
  user: User;
}