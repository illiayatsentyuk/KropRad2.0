import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Not, Repository } from 'typeorm';
import { SignupDto } from './dto';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enum/role.enum';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async getMe(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('No user found');
    if(user.role === Role.ADMIN){
      return { user, message: "Authenticated", role: Role.ADMIN };
    }
    return { user, message: "Authenticated", role: Role.USER };
  }

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const user = await this.userRepo.find({ where: { email: dto.email } });
    if (user.length >= 1) {
      throw new BadRequestException('Email already in use');
    }
    const newUser = this.userRepo.create({
      email: dto.email,
      hash,
      name: dto.name,
    });

    const savedUser = await this.userRepo.save(newUser);
    const tokens = await this.getTokens(savedUser.id, savedUser.email, savedUser.role);
    await this.updateRtHash(savedUser.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: SigninDto): Promise<Tokens> {
    const [user] = await this.userRepo.find({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('No user found');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.userRepo.update({ id: userId }, { hashedRt: null as any });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string, role: Role): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.userRepo.update({ id: userId }, { hashedRt: hash });
  }
}