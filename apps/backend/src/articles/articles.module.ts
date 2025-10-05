import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([Article])] ,
  providers: [ArticlesService]
})
export class ArticlesModule {}


