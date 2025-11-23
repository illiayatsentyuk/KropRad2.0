import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { ReactionService } from 'src/reaction/reaction.service';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,
        private reactionService: ReactionService,
        private imagesService: ImagesService
    ) { }

    async getAllArticles() {
        return this.articleRepository.find({ relations: ['reactions', "user"] })
    }

    async getArticleById(id: number) {
        return this.articleRepository.findOne({ where: { id }, relations: ['reactions', "user"] })
    }

    async createArticle(buffer: Buffer, userId: number) {
        if (!buffer) {
            throw new BadRequestException('No file buffer provided');
        }

        let result: { value: string };
        try {
            // 1️⃣ DOCX → HTML
            result = await mammoth.convertToHtml({ buffer }, {
                convertImage: (mammoth as any).images.inline(async (element) => {
                    const imageBuffer = await element.read('base64');
                    const contentType = element.contentType || 'image/png';
                    // Store image as base64 data URI directly in the content
                    const dataUri = `data:${contentType};base64,${imageBuffer}`;
                    return { src: dataUri };
                }),
            });
        } catch (err: any) {
            // Common when non-docx is uploaded; jszip cannot find central directory
            throw new BadRequestException('Invalid DOCX file. Please upload a valid .docx document.');
        }

        const $ = cheerio.load(result.value);
        const blocks: any[] = [];
        let tempList: any[] = [];

        $('body').children().each((_, el) => {
            const tag = el.tagName?.toLowerCase();
            if (!tag) return;

            // Заголовки
            if (/h\d/.test(tag)) {
                if (tempList.length) {
                    blocks.push({ type: 'unordered-list', items: tempList });
                    tempList = [];
                }
                blocks.push({ type: 'heading', html: $(el).html()?.trim() });
            }
            else if (['div', 'span', 'figure', 'table'].includes(tag)) {
                const innerText = $(el).text().trim();
                const innerHtml = $(el).html()?.trim();

                // Якщо всередині є текст і він не порожній
                if (innerText && innerText.length > 0) {
                    blocks.push({
                        type: 'floating-text',
                        html: innerHtml,
                    });
                }
            }
            // Абзаци
            else if (tag === 'p') {
                const text = $(el).text().trim();
                const html = $(el).html()?.trim();

                // Якщо це псевдосписок (починається з • або -)
                if (/^[•\-]\s*/.test(text)) {
                    const cleanHtml = html?.replace(/^[•\-]\s*/, '');
                    tempList.push({ html: cleanHtml });
                    return;
                }

                // Якщо перед цим був список — зберігаємо
                if (tempList.length) {
                    blocks.push({ type: 'unordered-list', items: tempList });
                    tempList = [];
                }

                // Посилання і зображення всередині параграфа
                const links: any[] = [];
                const images: any[] = [];
                $(el).find('a').each((_, a) => {
                    const href = $(a).attr('href');
                    const text = $(a).text();
                    if (href) links.push({ href, text });
                });
                $(el).find('img').each((_, img) => {
                    const src = $(img).attr('src');
                    if (src) images.push({ src });
                });

                if (images.length) {
                    blocks.push({
                        type: 'images',
                        html: html || null, // 💥 зберігаємо HTML з усім форматуванням
                        links: links.length ? links : null,
                        images: images.length ? images : null,
                    });
                }
                else if ((html || links.length) && !images.length) {
                    blocks.push({
                        type: 'paragraph',
                        html: html || null, // 💥 зберігаємо HTML з усім форматуванням
                        links: links.length ? links : null,
                        images: images.length ? images : null,
                    });
                }
            }

            // Справжні списки <ul> або <ol>
            else if (tag === 'ul' || tag === 'ol') {
                if (tempList.length) {
                    blocks.push({ type: 'unordered-list', items: tempList });
                    tempList = [];
                }

                const items: any[] = [];
                $(el).find('li').each((_, li) => {
                    items.push({ html: $(li).html()?.trim() });
                });

                if (items.length > 0) {
                    blocks.push({
                        type: tag === 'ul' ? 'unordered-list' : 'ordered-list',
                        items,
                    });
                }
            }

            // Окремі картинки
            else if (tag === 'img') {
                const src = $(el).attr('src');
                if (src) blocks.push({ type: 'image', src });
            }

            // Окремі посилання
            else if (tag === 'a') {
                const href = $(el).attr('href');
                const text = $(el).text();
                if (href) blocks.push({ type: 'link', text, href });
            }
        });

        // Якщо документ закінчується списком
        if (tempList.length) {
            blocks.push({ type: 'unordered-list', items: tempList });
        }

        // Заголовок
        const title =
            blocks.find((b) => b.type === 'heading')?.html?.replace(/<[^>]+>/g, '') ||
            blocks.find((b) => b.type === 'paragraph')?.html?.replace(/<[^>]+>/g, '') ||
            'Без назви';

        // Збереження в базу
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




    async updateArticle(id: number, buffer: Buffer) {
        if (!buffer) {
            throw new BadRequestException('No file buffer provided');
        }

        let result: { value: string };
        try {
            // 1️⃣ DOCX → HTML
            result = await mammoth.convertToHtml({ buffer }, {
                convertImage: (mammoth as any).images.inline(async (element) => {
                    const imageBuffer = await element.read('base64');
                    const contentType = element.contentType || 'image/png';
                    // Store image as base64 data URI directly in the content
                    const dataUri = `data:${contentType};base64,${imageBuffer}`;
                    return { src: dataUri };
                }),
            });
        } catch {
            throw new BadRequestException('Invalid DOCX file. Please upload a valid .docx document.');
        }

        const $ = cheerio.load(result.value);
        const blocks: any[] = [];
        let tempList: any[] = [];

        $('body').children().each((_, el) => {
            const tag = el.tagName?.toLowerCase();
            if (!tag) return;

            // Заголовки
            if (/h\d/.test(tag)) {
                if (tempList.length) {
                    blocks.push({ type: 'unordered-list', items: tempList });
                    tempList = [];
                }
                blocks.push({ type: 'heading', html: $(el).html()?.trim() });
            }

            // Абзаци
            else if (tag === 'p') {
                const text = $(el).text().trim();
                const html = $(el).html()?.trim();

                // Якщо це псевдосписок (починається з • або -)
                if (/^[•\-]\s*/.test(text)) {
                    const cleanHtml = html?.replace(/^[•\-]\s*/, '');
                    tempList.push({ html: cleanHtml });
                    return;
                }

                // Якщо перед цим був список — зберігаємо
                if (tempList.length) {
                    blocks.push({ type: 'unordered-list', items: tempList });
                    tempList = [];
                }

                // Посилання і зображення всередині параграфа
                const links: any[] = [];
                const images: any[] = [];
                $(el).find('a').each((_, a) => {
                    const href = $(a).attr('href');
                    const text = $(a).text();
                    if (href) links.push({ href, text });
                });
                $(el).find('img').each((_, img) => {
                    const src = $(img).attr('src');
                    if (src) images.push({ src });
                });

                if (images.length) {
                    blocks.push({
                        type: 'images',
                        html: html || null, // 💥 зберігаємо HTML з усім форматуванням
                        links: links.length ? links : null,
                        images: images.length ? images : null,
                    });
                }
                else if ((html || links.length) && !images.length) {
                    blocks.push({
                        type: 'paragraph',
                        html: html || null, // 💥 зберігаємо HTML з усім форматуванням
                        links: links.length ? links : null,
                        images: images.length ? images : null,
                    });
                }
            }

            // Справжні списки <ul> або <ol>
            else if (tag === 'ul' || tag === 'ol') {
                if (tempList.length) {
                    blocks.push({ type: 'unordered-list', items: tempList });
                    tempList = [];
                }

                const items: any[] = [];
                $(el).find('li').each((_, li) => {
                    items.push({ html: $(li).html()?.trim() });
                });

                if (items.length > 0) {
                    blocks.push({
                        type: tag === 'ul' ? 'unordered-list' : 'ordered-list',
                        items,
                    });
                }
            }

            // Окремі картинки
            else if (tag === 'img') {
                const src = $(el).attr('src');
                if (src) blocks.push({ type: 'image', src });
            }

            // Окремі посилання
            else if (tag === 'a') {
                const href = $(el).attr('href');
                const text = $(el).text();
                if (href) blocks.push({ type: 'link', text, href });
            }
        });

        // Якщо документ закінчується списком
        if (tempList.length) {
            blocks.push({ type: 'unordered-list', items: tempList });
        }

        // Заголовок
        const title =
            blocks.find((b) => b.type === 'heading')?.html?.replace(/<[^>]+>/g, '') ||
            blocks.find((b) => b.type === 'paragraph')?.html?.replace(/<[^>]+>/g, '') ||
            'Без назви';

        await this.reactionService.deleteAllReaction(id)

        // Збереження в базу
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
        // Load article to verify it exists
        const article = await this.articleRepository.findOne({ where: { id } })
        if (!article) {
            throw new BadRequestException('Article not found')
        }

        // Since images are now stored as base64 in the content, no file cleanup needed
        await this.reactionService.deleteAllReaction(id)

        await this.articleRepository.delete(id)
        return { message: 'deleted' }
    }
}
