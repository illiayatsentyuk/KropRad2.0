import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ReactionModule } from 'src/reaction/reaction.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [ArticlesController],
  imports: [ReactionModule, ImagesModule] ,
  providers: [ArticlesService]
})
export class ArticlesModule {}


