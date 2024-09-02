import { Priority, TodoStatus } from '@/common/type';
import { Project } from '@/entity/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  todoId: string;

  @Column()
  todoName: string;

  @Column()
  title: string;

  @Column()
  label: string;

  @Column()
  description: string;

  @Column()
  priority: Priority;

  @Column()
  todoStatus: TodoStatus;

  @Column('text', { array: true, nullable: true })
  projects: string[];

  @Column('text', { array: true, nullable: true })
  assignee: string[];

  @CreateDateColumn({ type: 'timestamp'})
  public createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updateAt: Date;

  @ManyToOne(() => Project, (project: any) => project.todos)
  project: string;
}
