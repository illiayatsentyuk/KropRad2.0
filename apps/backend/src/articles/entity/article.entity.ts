import { Reaction } from 'src/reaction/entity/reaction.entity';
import { User } from 'src/users/entity/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany
  } from 'typeorm';

  @Entity()
  export class Article {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: 'jsonb' })
    content: any[];
  
    @ManyToOne(()=>User,(user)=>user.articles)
    user: User

    @OneToMany(()=>Reaction, (reaction)=>reaction.article)
    reactions: Reaction[]
}
  