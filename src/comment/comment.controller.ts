import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CommentService} from './comment.service';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from './dto/update-comment.dto';
import {User} from 'src/Decorators/user.decorator';
import {JwtAuthGuard} from 'src/auth/guard/jwt-auth.guard';
import {PaginationCommentDto} from "./dto/pagination-comment.dto";

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@User() userId: number, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(createCommentDto, userId);
    }

    @Get()
    findAll(@Query() query: { articleId: number }) {
        return this.commentService.findAll(query.articleId);
    }

    @Get('/u')
    findAllByUserId(@Query() query: PaginationCommentDto) {
        return this.commentService.findAllByUserId(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commentService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(+id, updateCommentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commentService.remove(+id);
    }
}
