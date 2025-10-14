import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { User } from 'src/users/entity/user.entity';
@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([Article]), TypeOrmModule.forFeature([User])],
  providers: [ArticlesService]
})
export class ArticlesModule { }


