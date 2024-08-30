import { Priority, TodoStatus } from '@/common/type';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

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
}
