import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async createImage(data: string, mimeType: string, filename?: string) {
        return await this.prisma.image.create({
            data: {
                data,
                mimeType,
                filename,
            },
        });
    }

    async getImageById(id: number) {
        return await this.prisma.image.findUnique({ where: { id } });
    }

    async deleteImage(id: number): Promise<void> {
        await this.prisma.image.delete({ where: { id } });
    }
}

