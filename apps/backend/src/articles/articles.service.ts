import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
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

    async createArticle(filePath: string, userId: number) {
        const buffer = fs.readFileSync(filePath);

        // 1️⃣ Конвертація DOCX → HTML
        const result = await mammoth.convertToHtml({ buffer }, {
            convertImage: (mammoth as any).images.inline(async (element) => {
                const imageBuffer = await element.read('base64');
                const filename = `image-${Date.now()}.png`;
                const fullPath = `./uploads/${filename}`;
                fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                return { src: `/uploads/${filename}` };
            }),
        });

        // 2️⃣ Парсинг HTML → блоки
        const $ = cheerio.load(result.value);
        const blocks: any[] = [];

        $('body').children().each((_, el) => {
            const tag = el.tagName?.toLowerCase();
            if (!tag) return;

            if (/h\d/.test(tag)) {
                blocks.push({ type: 'heading', content: $(el).text() });
            }
            else if (tag === 'p') {
                const links: any[] = [];
                const images: any[] = [];

                // Витягуємо посилання з абзацу
                $(el).find('a').each((_, a) => {
                    const href = $(a).attr('href');
                    const text = $(a).text();
                    if (href) {
                        links.push({ href, text });
                    }
                });

                // Витягуємо картинки з абзацу
                $(el).find('img').each((_, img) => {
                    const src = $(img).attr('src');
                    if (src) images.push({ src });
                });

                const text = $(el).clone().children('a,img').remove().end().text().trim();

                if (text || links.length || images.length) {
                    blocks.push({
                        type: 'paragraph',
                        content: text || null,
                        links: links.length ? links : null,
                        images: images.length ? images : null,
                    });
                }
            }
            else if (tag === 'img') {
                const src = $(el).attr('src');
                if (src) blocks.push({ type: 'image', src });
            }
            else if (tag === 'a') {
                const href = $(el).attr('href');
                const text = $(el).text();
                if (href) blocks.push({ type: 'link', text, href });
            }
        });

        // 3️⃣ Заголовок
        const title = blocks.find((b) => b.type === 'heading')?.content || 'Без назви';

        // 4️⃣ Зберігаємо в базу
        const article = this.articleRepository.create({
            title,
            content: blocks,
            user: { id: userId },
        });

        await this.articleRepository.save(article);

        return {
            message: 'Файл оброблено та збережено',
            article,
        };
    }


    async updateArticle(id: number, filePath: string) {
        const buffer = fs.readFileSync(filePath);

        // 1️⃣ Конвертація DOCX → HTML
        const result = await mammoth.convertToHtml({ buffer }, {
            convertImage: (mammoth as any).images.inline(async (element) => {
                const imageBuffer = await element.read('base64');
                const filename = `image-${Date.now()}.png`;
                const fullPath = `./uploads/${filename}`;
                fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                return { src: `/uploads/${filename}` };
            }),
        });

        // 2️⃣ Парсинг HTML → блоки
        const $ = cheerio.load(result.value);
        const blocks: any[] = [];

        $('body').children().each((_, el) => {
            const tag = el.tagName?.toLowerCase();
            if (!tag) return;

            if (/h\d/.test(tag)) {
                blocks.push({ type: 'heading', content: $(el).text() });
            }
            else if (tag === 'p') {
                const links: any[] = [];
                const images: any[] = [];

                // Витягуємо посилання з абзацу
                $(el).find('a').each((_, a) => {
                    const href = $(a).attr('href');
                    const text = $(a).text();
                    if (href) {
                        links.push({ href, text });
                    }
                });

                // Витягуємо картинки з абзацу
                $(el).find('img').each((_, img) => {
                    const src = $(img).attr('src');
                    if (src) images.push({ src });
                });

                const text = $(el).clone().children('a,img').remove().end().text().trim();

                if (text || links.length || images.length) {
                    blocks.push({
                        type: 'paragraph',
                        content: text || null,
                        links: links.length ? links : null,
                        images: images.length ? images : null,
                    });
                }
            }
            else if (tag === 'img') {
                const src = $(el).attr('src');
                if (src) blocks.push({ type: 'image', src });
            }
            else if (tag === 'a') {
                const href = $(el).attr('href');
                const text = $(el).text();
                if (href) blocks.push({ type: 'link', text, href });
            }
        });

        // 3️⃣ Заголовок
        const title = blocks.find((b) => b.type === 'heading')?.content || 'Без назви';

        // 4️⃣ Зберігаємо в базу
        const article = await this.articleRepository.update(id, {
            title,
            content: blocks,
        });


        return {
            message: 'Файл оброблено та оновлено',
            article,
        };
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
