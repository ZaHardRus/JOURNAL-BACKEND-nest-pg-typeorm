import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { searchArticleDto } from './dto/search-article.dto';
import { PaginationArticleDto } from './dto/pagination-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private repository: Repository<ArticleEntity>,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return this.repository.save(createArticleDto);
  }

  findAll() {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const article = await this.repository.findOne(id);
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }
    await this.repository
      .createQueryBuilder('articles')
      .whereInIds(id)
      .update()
      .set({ views: () => 'views+1' })
      .execute();

    return this.repository.findOne(id);
  }

  // async popular(skip:number) {
  //   return this.repository.find({
  //     order:{views:'DESC'},
  //     skip: skip
  //   });
  // }
  async popular(dto: PaginationArticleDto) {
    const qb = this.repository.createQueryBuilder('articles');
    qb.leftJoinAndSelect('sa.user', 'user');
    qb.orderBy('views', 'DESC');
    qb.limit(+dto.limit);
    qb.offset(+dto.limit * +dto.page - +dto.limit || 0);
    const [articles, total] = await qb.getManyAndCount();
    return {
      articles,
      total,
    };
  }

  async search(dto: searchArticleDto) {
    const qb = this.repository.createQueryBuilder('sa');
    qb.limit(dto.limit || 10);
    qb.offset(+dto.limit * +dto.page - +dto.limit || 0);
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
    return { items, total };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.repository.findOne(id);
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }
    return this.repository.update(id, updateArticleDto);
  }

  async remove(id: number) {
    const article = await this.repository.findOne(id);
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }
    return this.repository.delete(id);
  }
}
