import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Priority, TodoStatus } from '@/common/type';
import { Attachment } from '@/entity/attachment.entity';
import { Project } from '@/entity/project.entity';

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
  public createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updateAt: Date;

  @ManyToOne(() => Project, (project: any) => project.todos)
  project: string;

  @OneToMany(() => Attachment, (attachment: any) => attachment.todo)
  attachments: any;
}
