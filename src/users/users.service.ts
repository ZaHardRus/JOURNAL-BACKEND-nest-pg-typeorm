import {ForbiddenException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from './entities/user.entity';
import {Repository} from 'typeorm';
import {LoginUserDto} from './dto/login-user.dto';
import {FollowUserDto} from './dto/follow-user.dto';
import {SearchUserDto} from './dto/search-user.dto';
import {ArticleEntity} from "../article/entities/article.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {
    }

    create(createUserDto: CreateUserDto) {
        return this.repository.save(createUserDto);
    }

    findAll() {
        return this.repository.find();
    }

    async findOne(id: number) {
        const user = await this.repository.findOne(id)
        if(!user){
            throw new ForbiddenException('not found')
        }
        const qb =  await this.repository
            .createQueryBuilder('u')
            .where('u.id = :id',{id})
            .leftJoinAndMapMany(
                'u.articles',
                ArticleEntity,
                'article',
                'article.userId = u.id'
            )
            .getOne();
        qb['articles'].map(el=>delete el['body'])
        return qb
    }

    findByCond(cond: LoginUserDto) {
        return this.repository.findOne(cond);
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.repository.update(id, updateUserDto);
    }

    // async follow(id: string, dto: FollowUserDto) {
    //   const userFollowers = await this.repository.findOne(+id);
    //   const newFollowers = userFollowers.followers;
    //   return await this.repository.update(id, {
    //     followers: [...newFollowers, dto.id],
    //   });
    // }
    async follow(id: string, dto: FollowUserDto) {
        const user = await this.repository.findOne(+id);
        user.followers = [...user.followers, dto.id];
        await this.repository.save(user);
        return user;
    }

    async search(dto: SearchUserDto) {
        const qb = this.repository.createQueryBuilder('su');
        qb.limit(+dto.limit || 10);
        qb.offset(+dto.limit * +dto.page - +dto.limit || 0);

        if (dto.email) {
            qb.andWhere(`su.email ILIKE :email`);
        }
        if (dto.id) {
            qb.andWhere(`su.id ILIKE :id`);
        }
        if (dto.fullName) {
            qb.andWhere(`su.fullName ILIKE :fullName`);
        }
        qb.setParameters({
            email: `%${dto.email}%`,
            id: `%${dto.id}%`,
            fullName: `%${dto.fullName}%`,
        });

        const [items, total] = await qb.getManyAndCount();
        return {items, total};
    }

    async getFollowers(id: number) {
        // const ids = await this.repository.findOne(+id);
        // return await this.repository.findByIds(ids.followers);
        const user = await this.repository.findOne(+id);
        const ids = user.followers;
        return this.repository.findByIds(ids);
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
