import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';
import { ReactionService } from 'src/reaction/reaction.service';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(Article) private articleRepository: Repository<Article>, private reactionService: ReactionService) { }

    async getAllArticles() {
        return this.articleRepository.find({ relations: ['reactions', "user"] })
    }

    async getArticleById(id: number) {
        return this.articleRepository.findOne({ where: { id }, relations: ['reactions', "user"] })
    }

    async createArticle(filePath: string, userId: number) {
        let buffer: Buffer | null = null;
        try {
            buffer = fs.readFileSync(filePath);
        } catch {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new BadRequestException('Failed to read uploaded file');
        }

        let result: { value: string };
        try {
            // 1️⃣ DOCX → HTML
            result = await mammoth.convertToHtml({ buffer }, {
                convertImage: (mammoth as any).images.inline(async (element) => {
                    const imageBuffer = await element.read('base64');
                    const filename = `image-${Date.now()}.png`;
                    const fullPath = `./uploads/${filename}`;
                    fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                    return { src: `/uploads/${filename}` };
                }),
            });
        } catch (err: any) {
            // Common when non-docx is uploaded; jszip cannot find central directory
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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

        // Видалення тимчасового файлу
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return {
            message: 'Файл оброблено та збережено',
            article,
        };
    }




    async updateArticle(id: number, filePath: string) {
        let buffer: Buffer | null = null;
        try {
            buffer = fs.readFileSync(filePath);
        } catch {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new BadRequestException('Failed to read uploaded file');
        }

        let result: { value: string };
        try {
            // 1️⃣ DOCX → HTML
            result = await mammoth.convertToHtml({ buffer }, {
                convertImage: (mammoth as any).images.inline(async (element) => {
                    const imageBuffer = await element.read('base64');
                    const filename = `image-${Date.now()}.png`;
                    const fullPath = `./uploads/${filename}`;
                    fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                    return { src: `/uploads/${filename}` };
                }),
            });
        } catch {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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

        // Видалення тимчасового файлу
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return {
            message: 'Файл оброблено та оновлено',
            article,
        };
    }

    async deleteArticle(id: number) {
        // Load article to collect related image files
        const article = await this.articleRepository.findOne({ where: { id } })
        if (!article) {
            throw new BadRequestException('Article not found')
        }

        const collectImageSrcs = (blocks: any[]): string[] => {
            if (!Array.isArray(blocks)) return []
            const acc = new Set<string>()

            const addFromHtml = (html?: string | null) => {
                if (!html || typeof html !== 'string') return
                try {
                    const $ = cheerio.load(html)
                    $('img').each((_, img) => {
                        const src = $(img).attr('src')
                        if (src) acc.add(src)
                    })
                } catch {}
            }

            for (const block of blocks) {
                if (!block) continue
                // Standalone image blocks
                if (block.type === 'image' && typeof block.src === 'string') {
                    acc.add(block.src)
                }
                // Multiple images in one block
                if (block.type === 'images' && Array.isArray(block.images)) {
                    for (const img of block.images) {
                        if (img && typeof img.src === 'string') acc.add(img.src)
                    }
                }
                // Paragraphs or floating text may contain inline <img>
                if (block.type === 'paragraph' || block.type === 'floating-text') {
                    addFromHtml(block.html)
                }
                // Lists contain items with HTML that may include <img>
                if ((block.type === 'unordered-list' || block.type === 'ordered-list') && Array.isArray(block.items)) {
                    for (const item of block.items) addFromHtml(item?.html)
                }
            }
            return Array.from(acc)
        }

        const srcs = collectImageSrcs((article as any).content)
        for (const src of srcs) {
            if (typeof src !== 'string') continue
            // Only delete local uploads
            if (!src.startsWith('/uploads/')) continue
            const relative = src.startsWith('/') ? src.slice(1) : src // remove leading '/'
            // Resolve to apps/backend/uploads regardless of compiled subdir depth
            const filePath = path.join(__dirname, '..', '..', relative)
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            } catch(err) {
                console.error(err)
            }
        }

        await this.reactionService.deleteAllReaction(id)

        await this.articleRepository.delete(id)
        return { message: 'deleted' }
    }
}
