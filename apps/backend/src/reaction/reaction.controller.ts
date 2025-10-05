import { Controller, Post, Body, BadRequestException, Req } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
    constructor(private reactionService: ReactionService){}
    
    @Post()
    async createReaction(@Body() body, @Req() req) {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const { articleId, reactionType, fingerprint } = body;
  
      if (!articleId || !reactionType || !fingerprint)
        throw new BadRequestException('Missing fields');
  
      return this.reactionService.addReaction(articleId, reactionType, fingerprint, ip);
    }
}
