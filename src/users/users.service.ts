import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {FindOneOptions, Repository} from "typeorm";
import {LoginUserDto} from "./dto/login-user.dto";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(UserEntity)
      private repository:Repository<UserEntity>
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.repository.save(createUserDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }
  findByCond(cond: LoginUserDto) {
    return this.repository.findOne(cond);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
