import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "@/entity/todo.entity";
// import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  filePath: string;

  @Column('text', { nullable: true })
  fileName: string;

  @ManyToOne(() => Todo, (todo: any) => todo.attachments)
  todo: string;
}