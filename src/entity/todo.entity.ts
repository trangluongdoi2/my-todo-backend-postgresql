import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Priority, TodoStatus } from '@/types/todo';
import { Attachment } from '@/entity/attachment.entity';
import { Project } from '@/entity/project.entity';
import { TodoStatusLog } from './todo_status_log.entity';
import { TodoComment } from './todo_comment.entity';

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
  assignee: string[];

  @CreateDateColumn({ type: 'timestamp'})
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @ManyToOne(() => Project, (project: any) => project.todos)
  project: string;

  @OneToMany(() => Attachment, (attachment: any) => attachment.todo)
  attachments: any;

  @OneToMany(() => TodoStatusLog, (statusLog: any) => statusLog.todo)
  statusLogs: TodoStatusLog[];

  @OneToMany(() => TodoComment, (comment: any) => comment.todo)
  comments: TodoComment[];
}
