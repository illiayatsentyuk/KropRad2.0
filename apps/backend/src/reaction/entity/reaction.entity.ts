import { Article } from 'src/articles/entity/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Article, (article)=>article.reactions)
  article: Article;

  @Column()
  reactionType: string;

  @Column()
  fingerprint: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}