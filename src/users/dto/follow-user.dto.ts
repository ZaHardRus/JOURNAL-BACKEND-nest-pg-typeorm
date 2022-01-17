import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CreateArticleDto } from '../../article/dto/create-article.dto';

export class FollowUserDto extends PartialType(CreateUserDto) {
  id: number;
}
