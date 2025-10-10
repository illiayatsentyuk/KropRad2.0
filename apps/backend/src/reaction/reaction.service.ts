import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entity/reaction.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private repo: Repository<Reaction>,
  ) { }

  async addReaction(articleId: number, reactionType: string, fingerprint: string, ip: string) {
    const exists = await this.repo.exists({
      where: { article: { id: articleId }, fingerprint },
    });
    if (exists) throw new BadRequestException('Already reacted');

    // Optional rate-limit check
    const recent = await this.repo.count({
      where: { ip, article: { id: articleId } },
    });
    if (recent > 10) throw new BadRequestException('Too many reactions from this IP');

    const reaction = this.repo.create({ article: { id: articleId }, reactionType, fingerprint, ip });
    return this.repo.save(reaction);
  }
}