import { RoleUser } from '@/common/user';
import { Project } from '@/entity/project.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: RoleUser.ADMIN, nullable: true })
  role: RoleUser

  @ManyToMany(() => Project, (project: any) => project.members)
  projects: Project[]
  // @OneToMany(() => Todo, (todo: any) => todo.owner)
  // todos: Todo[]
}