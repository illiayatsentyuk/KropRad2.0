import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/common/decorators';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Public()
    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }
}