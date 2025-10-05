import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';  
import { User } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { Article } from './articles/entity/article.entity';
import { ArticlesModule } from './articles/articles.module';
import { ReactionModule } from './reaction/reaction.module';
import { Reaction } from './reaction/entity/reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'kroprad',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'I562530y2009',
      entities: [User, Article, Reaction],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}