import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import {CreateArticleDto} from './dto/create-article.dto';
import {UpdateArticleDto} from './dto/update-article.dto';
import {searchArticleDto} from './dto/search-article.dto';
import {PaginationArticleAllDto} from "./dto/pagination-articleAll.dto";
import {ArticleEntity} from './entities/article.entity';
import {UserEntity} from "../users/entities/user.entity";
import {CommentService} from "../comment/comment.service";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private repository: Repository<ArticleEntity>,
        private commentsService: CommentService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }

    create(dto: CreateArticleDto, userId) {
        const description = dto.body.find(el => el.type === 'paragraph')?.data.text
        return this.repository.save({
            title: dto.title,
            body: dto.body,
            tags: dto.tags,
            user: {id: userId},
            description: description || ''
        });
    }

    findAll(query) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;
        const keyword = query.keyword || ''

        return this.repository.findAndCount({
            where: {title: Like('%' + keyword + '%')}, order: {createdAt: "DESC"},
            take: take,
            skip: skip,
        });
    }

    async findAllByUserId(query) {
        const userId = query.userId
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        const [data, count] = await this.repository.findAndCount({
            where: {user: userId},
            order: {createdAt: "DESC"},
            take: take,
            skip: skip,
            relations: ['user'],
        });
        return [data, count]
    }

    async findOne(id: number) {
        const article = await this.repository.findOne(id);
        if (!article) {
            throw new NotFoundException('Статья не найдена');
        }
        await this.repository
            .createQueryBuilder('articles')
            .whereInIds(id)
            .leftJoinAndSelect('articles.user', 'user')
            .update()
            .set({views: () => 'views+1'})
            .execute();

        return this.repository.findOne(id);
    }

    async popular(query: PaginationArticleAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        return await this.repository.createQueryBuilder('articles')
            .leftJoinAndSelect('articles.user', 'user')
            .orderBy('articles.likes', "DESC")
            .take(take)
            .skip(skip)
            .getManyAndCount()

    }

    async search(dto: searchArticleDto) {
        const qb = this.repository.createQueryBuilder('sa');
        qb.limit(dto.limit || 10);
        qb.offset((+dto.limit * +dto.page) - +dto.limit || 0);
        qb.leftJoinAndSelect('sa.user', 'user');

        if (dto.body) {
            qb.andWhere(`sa.body ILIKE :body`);
        }
        if (dto.title) {
            qb.andWhere(`sa.title ILIKE :title`);
        }
        if (dto.tags) {
            qb.andWhere(`sa.tags ILIKE :tags`);
        }
        qb.setParameters({
            title: `%${dto.title}%`,
            body: `%${dto.body}%`,
            tags: `%${dto.tags}%`,
        });
        const [items, total] = await qb.getManyAndCount();
        return {items, total};
    }

    async update(id: number, dto: UpdateArticleDto, userId) {
        const article = await this.repository.findOne(id);
        const description = dto.body.find(el => el.type === 'paragraph')?.data.text
        if (!article) {
            throw new NotFoundException('Статья не найдена');
        }
        return this.repository.update(id, {
            title: dto.title,
            body: dto.body,
            tags: dto.tags,
            user: {id: userId},
            description: description || ''
        });
    }

    async remove(id: number, userId) {
        const article = await this.repository.findOne(id);
        if (!article) {
            throw new NotFoundException('Статья не найдена');
        }
        if (article.user.id !== userId) {
            throw new ForbiddenException('Нет доступа');
        }
        await this.commentsService.removeByArticle(id)
        return await this.repository.delete(id);
    }

    async like(articleId, userId) {
        const article = await this.repository.findOne(articleId);
        if (article.likes.find(el => el === userId)) {
            article.likes = article.likes.filter(el => el !== userId);
        } else {
            article.likes = [...article.likes, userId];
        }
        await this.repository.save(article);
        return article;
    }

    async dislike(articleId, userId) {
        const article = await this.repository.findOne(articleId);
        if (article.dislikes.find(el => el === userId)) {
            article.dislikes = [...article.dislikes.filter(el => el !== userId)];
        } else {
            article.dislikes = [...article.dislikes, userId];
        }
        await this.repository.save(article);
        return article;
    }

    async getFeed(id: number, query: PaginationArticleAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        const {following} = await this.userRepository.findOne(id)
        return await this.repository.createQueryBuilder('articles')
            .leftJoinAndSelect('articles.user', 'user')
            .where('articles.user IN (:...following)', {following})
            .orderBy('articles.createdAt', "DESC")
            .take(take)
            .skip(skip)
            .getManyAndCount()
    }
}
