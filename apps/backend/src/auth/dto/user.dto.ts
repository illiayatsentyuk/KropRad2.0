import { Expose, Transform } from "class-transformer";
import { Role } from "src/enum/role.enum";

export class UserDto {
    @Expose()
    @Transform(({obj}) => {
        return{
            id: obj.user.id,
            email: obj.user.email,
            role: obj.user.role,
        }
    })
    user: {
        id: number;
        email: string;
        role: Role;
    };

    @Expose()
    message: string;

    @Expose()
    role: Role;
}