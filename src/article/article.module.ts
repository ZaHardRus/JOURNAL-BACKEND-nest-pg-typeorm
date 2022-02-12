import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import {CommentService} from "../comment/comment.service";
import {CommentEntity} from "../comment/entities/comment.entity";
import {UserEntity} from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity,CommentEntity,UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService,CommentService],
})
export class ArticleModule {}
