import {ForbiddenException, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from '../users/users.service';
import {UserEntity} from '../users/entities/user.entity';
import {CreateUserDto} from '../users/dto/create-user.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService) {
    }

    generateJwtToken(data: { id: number; email: string }) {
        const payload = {email: data.email, sub: data.id};
        return this.jwtService.sign(payload);
    }

    async validateUser(email: string, passwordDTO: string) {
        const user = await this.usersService.findByCond({email})
        const decodePassword = await bcrypt.compare(passwordDTO, user.password)

        if (user && decodePassword) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: UserEntity) {
        const {password, ...userData} = user;
        return {
            ...userData,
            access_token: this.generateJwtToken(userData)
        }
    }

    async registration(dto: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 10)
            const {password, ...user} = await this.usersService.create({
                fullName: dto.fullName,
                email: dto.email,
                password: hashedPassword
            });
            return user;
        } catch (e) {
            console.log(e)
            throw new ForbiddenException('registration failed');
        }
    }
}
