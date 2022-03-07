import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ArticleController} from './article.controller';
import {ArticleEntity} from './entities/article.entity';
import {CommentEntity} from "../comment/entities/comment.entity";
import {UserEntity} from "../users/entities/user.entity";
import {ArticleService} from './article.service';
import {CommentService} from "../comment/comment.service";

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity, CommentEntity, UserEntity])],
    controllers: [ArticleController],
    providers: [ArticleService, CommentService],
})
export class ArticleModule {
}
