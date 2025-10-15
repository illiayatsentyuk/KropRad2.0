import { Controller, Post, Body, BadRequestException, Req, Get, Param, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { Public } from 'src/common/decorators';
import { Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guards';
import { Role } from 'src/enum/role.enum';

@Controller('reaction')
export class ReactionController {
    constructor(private reactionService: ReactionService){}
    
    @Public()
    @Post()
    async createReaction(@Body() body, @Req() req) {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      let { articleId, reactionType, fingerprint, rating } = body;
  
      // Allow numeric rating 1-5 as a convenience
      if (rating != null && (Number.isFinite(+rating))) {
        const stars = Math.max(1, Math.min(5, parseInt(rating, 10)));
        reactionType = `rating-${stars}`;
      }

      if (!articleId || !reactionType || !fingerprint)
        throw new BadRequestException('Missing fields');
  
      return this.reactionService.addReaction(articleId, reactionType, fingerprint, ip);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get('average/:articleId')
    async getAverage(@Param('articleId') articleId: string) {
      const id = parseInt(articleId, 10)
      if (!Number.isFinite(id)) throw new BadRequestException('Invalid article id')
      return this.reactionService.getAverageRating(id)
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get('distribution/:articleId')
    async getDistribution(@Param('articleId') articleId: string) {
      const id = parseInt(articleId, 10)
      if (!Number.isFinite(id)) throw new BadRequestException('Invalid article id')
      return this.reactionService.getRatingDistribution(id)
    }
}
