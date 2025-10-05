import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/enum/role.enum';

@Roles(Role.ADMIN)
@Serialize(UserDto)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }

    
}