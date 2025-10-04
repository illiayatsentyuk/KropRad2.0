import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';  
import { User } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';

//postgresql://postgres.rorijfampwgnvuoglolx:[YOUR-PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'kroprad',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'I562530y2009',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
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