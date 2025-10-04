
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;
  
    @Column()
    hash: string;
  
    @Column({ type: 'text', nullable: true, unique: true })
    hashedRt!: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}
  