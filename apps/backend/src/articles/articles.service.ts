import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(Article) private articleRepository: Repository<Article>) { }

    async getAllArticles() {
        return this.articleRepository.find({ relations: ['reactions', "user"] })
    }

    async getArticleById(id: number) {
        return this.articleRepository.findOne({ where: { id }, relations: ['reactions', "user"] })
    }

    async createArticle(filePath: string) {
        const buffer = fs.readFileSync(filePath);

        // 1️⃣ Конвертуємо DOCX у HTML
        const result = await mammoth.convertToHtml({ buffer }, {
            convertImage: (mammoth as any).images.inline(async (element) => {
                const imageBuffer = await element.read('base64');
                const filename = `image-${Date.now()}.png`;
                const fullPath = `./uploads/${filename}`;
                fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                return { src: `/uploads/${filename}` };
            }),
        });

        // 2️⃣ Парсимо HTML у блоки
        const $ = cheerio.load(result.value);
        const blocks: any[] = [];

        $('body *').each((_, el) => {
            const tag = el.tagName?.toLowerCase();
            if (!tag) return;

            if (/h\d/.test(tag)) {
                blocks.push({ type: 'heading', content: $(el).text().trim() });
            } else if (tag === 'p') {
                const text = $(el).text().trim();
                if (text && !$(el).find('img').length) {
                    blocks.push({ type: 'paragraph', content: text });
                }
            } else if (tag === 'img') {
                blocks.push({ type: 'image', src: $(el).attr('src') });
            }
        });

        // 3️⃣ Визначаємо заголовок
        const title =
            blocks.find((b) => b.type === 'heading')?.content || 'Без назви';

        // 4️⃣ Зберігаємо в базу через TypeORM
        const article = this.articleRepository.create({
            title,
            content: blocks,
        });

        await this.articleRepository.save(article);

        return {
            message: 'Файл оброблено та збережено',
            article,
        };
    }

    async updateArticle(id: number, article: CreateArticleDto) {
        return this.articleRepository.update(id, article)
    }

    async deleteArticle(id: number) {
        try {
            await this.articleRepository.delete(id)
        } catch (error) {
            throw new BadRequestException('Article not found')
        }
        return { message: 'deleted' }
    }
}
