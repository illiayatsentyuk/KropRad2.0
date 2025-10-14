import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async getAllArticles() {
        return this.articleRepository.find({ relations: ['reactions', "user"] })
    }

    async getArticleById(id: number) {
        return this.articleRepository.findOne({ where: { id }, relations: ['reactions', "user"] })
    }

    async createArticle(filePath: string, userId: number) {
        const buffer = fs.readFileSync(filePath);

        // 1️⃣ Конвертуємо DOCX → HTML (зберігаючи стиль)
        const result = await mammoth.convertToHtml({ buffer }, {
            styleMap: [
                "p[style-name='Normal'] => p:fresh",
                "r[style-name='Hyperlink'] => a",
                "i => em",
                "b => strong",
            ],
            convertImage: (mammoth as any).images.inline(async (element) => {
                const imageBuffer = await element.read('base64');
                const filename = `image-${Date.now()}.png`;
                const fullPath = `./uploads/${filename}`;
                fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                return { src: `/uploads/${filename}` };
            }),
        });

        const htmlContent = result.value;

        // 2️⃣ Визначаємо заголовок
        const $ = cheerio.load(htmlContent);
        const title =
            $('h1').first().text() ||
            $('h2').first().text() ||
            'Без назви';

        // 3️⃣ Зберігаємо HTML як є (включно з <img>, <a>, <p>, <strong>, <em> тощо)
        const user = await this.userRepository.findOne({ where: { id: userId } })
        const article = this.articleRepository.create({
            title,
            content: htmlContent,
            user: user || undefined,
        });

        await this.articleRepository.save(article);

        return {
            message: 'Файл оброблено та збережено',
            article,
        };
    }


    async updateArticle(id: number, filePath: string) {
        const buffer = fs.readFileSync(filePath);

        // 1️⃣ Конвертуємо DOCX → HTML (зберігаючи стиль)
        const result = await mammoth.convertToHtml({ buffer }, {
            styleMap: [
                "p[style-name='Normal'] => p:fresh",
                "r[style-name='Hyperlink'] => a",
                "i => em",
                "b => strong",
            ],
            convertImage: (mammoth as any).images.inline(async (element) => {
                const imageBuffer = await element.read('base64');
                const filename = `image-${Date.now()}.png`;
                const fullPath = `./uploads/${filename}`;
                fs.writeFileSync(fullPath, Buffer.from(imageBuffer, 'base64'));
                return { src: `/uploads/${filename}` };
            }),
        });

        const htmlContent = result.value;

        // 2️⃣ Визначаємо заголовок
        const $ = cheerio.load(htmlContent);
        const title =
            $('h1').first().text() ||
            $('h2').first().text() ||
            'Без назви';

        // 3️⃣ Зберігаємо HTML як є (включно з <img>, <a>, <p>, <strong>, <em> тощо)
        const article = await this.articleRepository.update(id, {
            title,
            content: htmlContent, // тут зберігається весь HTML
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
