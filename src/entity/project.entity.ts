import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column('text', { array: true })
  todoItems: string[];

  @Column('text', { array: true })
  members: string[];
}
