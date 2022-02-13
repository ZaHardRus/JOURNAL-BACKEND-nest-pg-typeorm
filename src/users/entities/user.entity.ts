import { CommentEntity } from 'src/comment/entities/comment.entity';
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ArticleEntity} from "../../article/entities/article.entity";
import {Exclude} from "class-transformer";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column('int', { array: true, default: [] })
  following: number[];

  @Column('int', { array: true, default: [] })
  followers: number[];

  @Column()
  password: string;

  @Column({nullable:true})
  avatarUrl: string;

  @OneToMany(() => ArticleEntity, (article) => article.user, {
    eager: false,
    nullable: true,
  })
  comments: ArticleEntity[];

  toJSON () {
    delete this.password;
    return this;
  }

}
