import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './entity/article.entity';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { Role } from 'src/enum/role.enum';
import { CreateArticleDto } from './dto/create-article.dto';
import { Public } from 'src/common/decorators';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ArticleDto } from './dto/article.dto';
import { RolesGuard } from 'src/common/guards';

@Controller('articles')
export class ArticlesController {
    constructor(private articlesService: ArticlesService){

    }

    @Serialize(ArticleDto)
    @Public()
    @Get("/")
    getAllArticles(){
        return this.articlesService.getAllArticles()
    }

    @Serialize(ArticleDto)
    @Public()
    @Get("/:id")
    getArticleById(@Param("id") id: number){
        return this.articlesService.getArticleById(id)
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post("/")
    createArticle(@Body() article: CreateArticleDto, @GetCurrentUserId() userId: number){
        return this.articlesService.createArticle(article, userId)
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Put("/:id")
    updateArticle(@Param("id") id: number, @Body() article: CreateArticleDto){
        return this.articlesService.updateArticle(id, article)
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete("/:id")
    deleteArticle(@Param("id") id: number){
        return this.articlesService.deleteArticle(id)
    }
}
