import { Todo } from '@/entity/todo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  projectId: string;

  @Column()
  projectName: string;

  @Column('text', { array: true, default: [] })
  todoItems: string[];

  @Column('text', { array: true, default: [] })
  members: string[];

  @CreateDateColumn({ type: 'timestamp'})
  public createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updateAt: Date;

  @OneToMany(() => Todo, (todo) => todo.todoId)
  todoIds: string[];
}
