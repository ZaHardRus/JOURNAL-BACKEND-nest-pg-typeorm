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
import {PaginationUsersAllDto} from "./dto/pagination-usersAll.dto";

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

    async findAll(query: PaginationUsersAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        return await this.repository.find({
            take: take,
            skip: skip
        })
    }

    async findOne(id: number) {
        const user = await this.repository.findOne(id)
        if (!user) {
            throw new ForbiddenException('not found')
        }
        return await this.repository
            .createQueryBuilder('u')
            .where('u.id = :id', {id})
            .leftJoinAndMapMany(
                'u.articles',
                ArticleEntity,
                'article',
                'article.userId = u.id'
            )
            .getOne();
    }

    findByCond(cond: LoginUserDto) {
        return this.repository.findOne(cond);
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.repository.update(id, updateUserDto);
    }

    //todo: отрефакторить!!!
    async follow(id: string, dto: FollowUserDto) {
        const user = await this.repository.findOne(+id);
        if (user.following.some(el => el === dto.id)) {
            return
        }
        user.following = [...user.following, dto.id];
        await this.repository.save(user);

        const me = await this.repository.findOne(dto.id)
        if (me.followers.some(el => el === dto.id)) {
            return
        }
        me.followers = [...me.followers, +id];
        await this.repository.save(me);

        return user;
    }

    async unFollow(id: string, dto: FollowUserDto) {
        const user = await this.repository.findOne(+id);
        if (!user.following.some(el => el === dto.id)) {
            return
        }
        user.following = user.following.filter(el => el !== dto.id);
        await this.repository.save(user);

        const me = await this.repository.findOne(dto.id)
        if (!me.followers.some(el => el === +id)) {
            return
        }
        me.followers = [...me.followers.filter(el => el !== +id)];
        await this.repository.save(me);

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

    async getFollowers(id: number, query: PaginationUsersAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        const user = await this.repository.findOne(+id);
        const ids = user.followers;
        return await this.repository.findByIds(ids, {
            take: take,
            skip: skip
        })
    }

    async getFollowing(id: number, query: PaginationUsersAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        const user = await this.repository.findOne(+id);
        const ids = user.following;
        return await this.repository.findByIds(ids, {
            take: take,
            skip: skip
        })
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
