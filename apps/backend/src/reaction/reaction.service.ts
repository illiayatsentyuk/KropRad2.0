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

  async deleteAllReaction(articleId: number) {
    await this.repo.delete({ article: { id: articleId } });
  }

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

  async getAverageRating(articleId: number) {
    const reactions = await this.repo.find({
      where: { article: { id: articleId } },
      select: { reactionType: true },
    })
    const ratings = reactions
      .map(r => r.reactionType)
      .filter(t => /^rating-[1-5]$/.test(t))
      .map(t => parseInt(t.split('-')[1], 10))
    if (ratings.length === 0) return { articleId, average: 0, count: 0 }
    const sum = ratings.reduce((a, b) => a + b, 0)
    const avg = sum / ratings.length
    return { articleId, average: Number(avg.toFixed(2)), count: ratings.length }
  }

  async getRatingDistribution(articleId: number) {
    const reactions = await this.repo.find({
      where: { article: { id: articleId } },
      select: { reactionType: true },
    })
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const r of reactions) {
      const match = /^rating-([1-5])$/.exec(r.reactionType)
      if (match) {
        const val = parseInt(match[1], 10)
        distribution[val] = (distribution[val] ?? 0) + 1
      }
    }
    const total = Object.values(distribution).reduce((a, b) => a + b, 0)
    return { articleId, total, distribution }
  }
}