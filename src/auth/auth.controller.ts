import {Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from './guard/jwt-auth.guard';
import {LocalAuthGuard} from './guard/local-auth.guard';
import {CreateUserDto} from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('registration')
    async registration(@Body() dto: CreateUserDto) {
        return this.authService.registration(dto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
