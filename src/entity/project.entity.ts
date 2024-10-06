import { Todo } from '@/entity/todo.entity';
import { User } from '@/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @CreateDateColumn({ type: 'timestamp'})
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @OneToMany(() => Todo, (todo: any) => todo.project)
  todos: Todo[]

  @ManyToMany(() => User, (user: any) => user.projects)
  @JoinTable()
  members: User[]
}
