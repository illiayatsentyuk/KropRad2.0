import { Expose, Transform } from "class-transformer";
import { Role } from "src/enum/role.enum";

export class ArticleDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    content: string;

    @Expose()
    @Transform(({obj}) => {
        if (!obj.user) return null
        return {
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