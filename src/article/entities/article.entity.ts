import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Optional} from "@nestjs/common";
import { UserEntity } from "src/users/entities/user.entity";

@Entity('articles')
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @ManyToOne(() => UserEntity, { eager: true })
    user: UserEntity;


    @Column()
    body:string

    @Column({nullable:true})
    tags?:string

    @Column({default:0})
    views: number

    @CreateDateColumn({type:'timestamp'})
    createdAt:Date

    @UpdateDateColumn({type:'timestamp'})
    updatedAt:Date
}
