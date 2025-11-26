import { Expose, Transform } from "class-transformer";
import { Role } from "@prisma/client";

export class ArticleDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    content: any[];

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