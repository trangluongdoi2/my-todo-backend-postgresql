import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  userId: string;
  
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
