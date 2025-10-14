import {
    Controller, Post, Get, Put, Delete, Param, Body, UseGuards, UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { Role } from 'src/enum/role.enum';
import { CreateArticleDto } from './dto/create-article.dto';
import { Public } from 'src/common/decorators';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ArticleDto } from './dto/article.dto';
import { RolesGuard } from 'src/common/guards';

@Controller('articles')
export class ArticlesController {
    constructor(private articlesService: ArticlesService) {

    }

    @Serialize(ArticleDto)
    @Public()
    @Get("/")
    getAllArticles() {
        return this.articlesService.getAllArticles()
    }

    @Serialize(ArticleDto)
    @Public()
    @Get("/:id")
    getArticleById(@Param("id") id: number) {
        return this.articlesService.getArticleById(id)
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post("/")
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (_, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    async createArticle(@UploadedFile() file: Express.Multer.File, @GetCurrentUserId() userId: number) {
        console.log(file)
        return this.articlesService.createArticle(file.path, userId);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Put("/:id")
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (_, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    updateArticle(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        return this.articlesService.updateArticle(id, file.path)
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete("/:id")
    deleteArticle(@Param("id") id: number) {
        return this.articlesService.deleteArticle(id)
    }
}
