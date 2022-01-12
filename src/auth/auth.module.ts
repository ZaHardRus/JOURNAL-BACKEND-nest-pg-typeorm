import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersService} from "../users/users.service";
import {UsersModule} from "../users/users.module";

import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategy/local.strategy";
import {UserEntity} from "../users/entities/user.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy/jwt.strategy";

@Module({
  imports:[UsersModule, PassportModule,TypeOrmModule.forFeature([UserEntity]),JwtModule.register({
    secret: 'test',
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy,JwtStrategy,UsersService]
})
export class AuthModule {}
