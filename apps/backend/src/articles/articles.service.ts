import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(Article) private articleRepository: Repository<Article>) {}

    async getAllArticles(){
        return this.articleRepository.find({relations: ['reactions', "user"]})
    }

    async getArticleById(id: number){
        return this.articleRepository.findOne({where: {id}, relations: ['reactions', "user"]})
    }

    async createArticle(article: CreateArticleDto, userId: number){
        return this.articleRepository.save({...article, user: {id: userId}})
    }

    async updateArticle(id: number, article: CreateArticleDto){
        return this.articleRepository.update(id, article)
    }

    async deleteArticle(id: number){
        try {
            await this.articleRepository.delete(id)
        } catch (error) {
            throw new BadRequestException('Article not found')
        }
        return {message: 'deleted'}
    }
}
