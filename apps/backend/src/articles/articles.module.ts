import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { ReactionModule } from 'src/reaction/reaction.module';
@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([Article]), ReactionModule] ,
  providers: [ArticlesService]
})
export class ArticlesModule {}


