import {
  Post,
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';
import {
  GetCurrentUserId,
  GetCurrentUser,
  Public,
} from '../common/decorators';
import { RtGuard } from '../common/guards';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Serialize(UserDto)
  @Get('/me')
  getMe(@GetCurrentUserId() userId: number) {
    return this.authService.getMe(userId)
  }

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: SigninDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }


  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('refreshToken') refreshTokens: string,
    @GetCurrentUserId() userId: number,
  ) {
    return this.authService.refreshTokens(userId, refreshTokens);
  }
}