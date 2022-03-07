import {Body, Controller, Delete, Get, Param, Patch, Query, Request, UseGuards,} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {FollowUserDto} from './dto/follow-user.dto';
import {JwtAuthGuard} from '../auth/guard/jwt-auth.guard';
import {PaginationUsersAllDto} from "./dto/pagination-usersAll.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    // @Get('search')
    // searchUser(@Query() query: SearchUserDto) {
    //   return this.usersService.search(query);
    // }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    editProfile(@Request() req, @Body() dto: UpdateUserDto) {
        return this.usersService.update(+req.user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('follow')
    follow(@Request() req, @Body() dto: FollowUserDto) {
        return this.usersService.follow(req.user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('unfollow')
    unFollow(@Request() req, @Body() dto: FollowUserDto) {
        return this.usersService.unFollow(req.user.id, dto);
    }

    @Get()
    findAll(@Query() query: PaginationUsersAllDto) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Get(':id/followers')
    getFollowers(@Param('id') id: number, @Query() query: PaginationUsersAllDto) {
        return this.usersService.getFollowers(id, query);
    }

    @Get(':id/following')
    getFollowing(@Param('id') id: number, @Query() query: PaginationUsersAllDto) {
        return this.usersService.getFollowing(id, query);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //   return this.usersService.update(+id, updateUserDto);
    // }
}
