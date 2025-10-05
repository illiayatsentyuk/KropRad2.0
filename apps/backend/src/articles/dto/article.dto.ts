import { Expose, Transform } from "class-transformer";
import { Article } from "../entity/article.entity";
import { Role } from "src/enum/role.enum";

export class ArticleDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(({obj}) => {
        return{
            id: obj.user.id,
            email: obj.user.email,
            name: obj.user.name,
            role: obj.user.role,
        }
    })
    user: {
        id: number;
        email: string;
        name: string;
        role: Role;
    };
}