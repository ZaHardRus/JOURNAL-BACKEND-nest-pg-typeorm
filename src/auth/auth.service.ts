import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByCond({ email, password });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      ...payload,
    };
  }

  // generationJWTToken(data: { id: number; email: string }) {
  //   const payload = {
  //     email: data.email,
  //     sub: data.id,
  //   };
  //   return this.jwtService.sign(payload);
  // }

  async registration(dto: CreateUserDto) {
    try {
      const { password, ...user } = await this.usersService.create(dto);
      return user;
    } catch (e) {
      throw new ForbiddenException('Sorry((');
    }
  }
}
