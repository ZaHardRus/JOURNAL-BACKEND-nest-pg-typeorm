import {Injectable} from '@nestjs/common';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from './dto/update-comment.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {CommentEntity} from './entities/comment.entity';
import {Repository} from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private repository: Repository<CommentEntity>,
    ) {
    }

    async create(createCommentDto: CreateCommentDto, userId: number) {
        const comment = await this.repository.save({
            text: createCommentDto.text,
            user: {id: userId},
            article: {id: createCommentDto.articleId},
        });
        return this.repository.findOne({id: comment.id}, {relations: ['user']})
    }

    async findAll(articleId: number) {
        const qb = this.repository.createQueryBuilder('c')
        if (articleId) {
            qb.where('c.articleId = :articleId', {articleId})
        }
        return await qb.leftJoinAndSelect('c.user', 'user')
            .leftJoinAndSelect('c.article', 'article')
            .select(['c', 'user', 'article.id', "article.title"])
            .orderBy({'c.createdAt': "DESC"})
            .getMany()
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
