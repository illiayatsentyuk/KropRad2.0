import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entity/reaction.entity';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
  imports: [TypeOrmModule.forFeature([Reaction])],
  exports: [ReactionService]
})
export class ReactionModule {}
