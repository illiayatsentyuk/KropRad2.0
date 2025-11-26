import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReactionService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async deleteAllReaction(articleId: number) {
    await this.prisma.reaction.deleteMany({ where: { articleId } });
  }

  async addReaction(articleId: number, reactionType: string, fingerprint: string, ip: string) {
    const exists = await this.prisma.reaction.findFirst({
      where: { articleId, fingerprint },
    });
    if (exists) throw new BadRequestException('Already reacted');

    // Optional rate-limit check
    const recent = await this.prisma.reaction.count({
      where: { ip, articleId },
    });
    if (recent > 10) throw new BadRequestException('Too many reactions from this IP');

    return this.prisma.reaction.create({ 
      data: { articleId, reactionType, fingerprint, ip } 
    });
  }

  async getAverageRating(articleId: number) {
    const reactions = await this.prisma.reaction.findMany({
      where: { articleId },
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
    const reactions = await this.prisma.reaction.findMany({
      where: { articleId },
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