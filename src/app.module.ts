import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {UserEntity} from './users/entities/user.entity';
import {ArticleModule} from './article/article.module';
import {ArticleEntity} from './article/entities/article.entity';
import {CommentModule} from './comment/comment.module';
import {CommentEntity} from './comment/entities/comment.entity';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule} from "./cloudinary/cloudinary.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '31711298Zahard',
            database: 'journal',
            entities: [UserEntity, ArticleEntity, CommentEntity],
            synchronize: true,
        }),
        UsersModule,
        ArticleModule,
        CommentModule,
        AuthModule,
        CloudinaryModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
