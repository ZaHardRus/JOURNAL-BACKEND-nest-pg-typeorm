import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}
  create(createCommentDto: CreateCommentDto, userId = 1) {
    return this.repository.save({
      text: createCommentDto.text,
      user: { id: userId },
      article: { id: createCommentDto.articleId },
    });
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.repository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
