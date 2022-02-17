import {ForbiddenException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from './entities/user.entity';
import {ILike, Like, Repository} from 'typeorm';
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
        const keyword = query.keyword

        if (keyword) {
            return await this.repository.findAndCount({
                where: {fullName: ILike('%' + keyword + '%')},
                take: take,
                skip: skip
            })
        }
        return await this.repository.findAndCount({
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

    // async search(query: SearchUserDto) {
    //     const qb = this.repository.createQueryBuilder('su');
    //     qb.limit(+query.take || 10);
    //     qb.offset(+query.take * +query.page - +query.take || 0);
    //     if (query.email) {
    //         qb.andWhere(`su.email ILIKE :email`);
    //     }
    //     if (query.id) {
    //         qb.andWhere(`su.id ILIKE :id`);
    //     }
    //     if (query.fullName) {
    //         qb.andWhere(`su.fullName ILIKE :fullName`);
    //     }
    //     qb.setParameters({
    //         email: `%${query.email}%`,
    //         id: `%${query.id}%`,
    //         fullName: `%${query.fullName}%`,
    //     });
    //
    //     return await qb.getManyAndCount();
    // }

    async getFollowers(id: number, query: PaginationUsersAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        const user = await this.repository.findOne(+id);
        const ids = user.followers;
        const followers =  await this.repository.findByIds(ids, {
            take: take,
            skip: skip
        })
        return [followers,ids.length]
    }

    async getFollowing(id: number, query: PaginationUsersAllDto) {
        const take = query.take || 10
        const page = query.page || 1;
        const skip = (page - 1) * take;

        const user = await this.repository.findOne(+id);
        const ids = user.following;
        const following = await this.repository.findByIds(ids, {
            take: take,
            skip: skip
        })
        return [following,ids.length]
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
