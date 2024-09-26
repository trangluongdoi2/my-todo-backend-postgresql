import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "@/entity/todo.entity";

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  filePath: string;

  @Column('text', { nullable: true })
  fileName: string;

  @ManyToOne(() => Todo, (todo: any) => todo.attachments)
  todo: string;
}