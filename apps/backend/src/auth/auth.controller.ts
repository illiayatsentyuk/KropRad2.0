import {
    Post,
    Controller,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto } from './dto/auth.dto';
  import { Tokens } from './types/tokens.type';
  import {
    GetCurrentUserId,
    GetCurrentUser,
    Public,
  } from '../common/decorators';
  import { RtGuard } from '../common/guards';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Public()
    @Post('/local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
      return this.authService.signupLocal(dto);
    }
  
    @Public()
    @Post('/local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
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