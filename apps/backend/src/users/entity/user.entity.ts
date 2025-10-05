import { Article } from 'src/articles/entity/article.entity';
import { Role } from 'src/enum/role.enum';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from 'typeorm';

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;

    @Column()
    name: string;
  
    @Column()
    hash: string;
  
    @Column({ type: 'text', nullable: true, unique: true })
    hashedRt!: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(()=>Article, (article)=>article.user)
    articles: Article[]

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;
}
  