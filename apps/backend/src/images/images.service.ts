import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entity/image.entity';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
    ) {}

    async createImage(data: string, mimeType: string, filename?: string): Promise<Image> {
        const image = this.imageRepository.create({
            data,
            mimeType,
            filename,
        });
        return await this.imageRepository.save(image);
    }

    async getImageById(id: number): Promise<Image | null> {
        return await this.imageRepository.findOne({ where: { id } });
    }

    async deleteImage(id: number): Promise<void> {
        await this.imageRepository.delete(id);
    }
}

