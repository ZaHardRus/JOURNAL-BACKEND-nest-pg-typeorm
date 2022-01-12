import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {ArticleEntity} from "../../article/entities/article.entity";

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => UserEntity, {nullable: true})
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @ManyToOne(() => ArticleEntity, {nullable: true})
    @JoinColumn({name: 'articleId'})
    article: ArticleEntity;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
}
