import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {searchArticleDto} from "./dto/search-article.dto";

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  // @Get(`/popular`)
  // getPopular(@Query('skip') skip:number) {
  //   return this.articleService.popular(skip);
  // }
  @Get(`/popular`)
  getPopular() {
    return this.articleService.popular();
  }

  @Get(`/search`)
  search(@Query() dto:searchArticleDto) {
    return this.articleService.search(dto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
