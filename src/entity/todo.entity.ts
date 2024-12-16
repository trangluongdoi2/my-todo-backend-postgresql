import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  todoName: string;

  @Column()
  title: string;

  @Column()
  label: string;

  @Column()
  description: string;

  @Column({ default: Priority.MEDIUM })
  priority: Priority;

  @Column({ default: TodoStatus.PENDING })
  todoStatus: TodoStatus;

  @Column('text', { array: true, nullable: true })
  assignee: string[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @ManyToOne(() => Project, (project: Project) => project.todos)
  project: Project;

  @OneToMany(() => Attachment, (attachment: Attachment) => attachment.todo)
  attachments: Attachment[];

  @OneToMany(() => TodoStatusLog, (statusLog: TodoStatusLog) => statusLog.todo, { cascade: true })
  statusLogs: TodoStatusLog[];

  @OneToMany(() => TodoComment, (comment: TodoComment) => comment.todo)
  comments: TodoComment[];
}
