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
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
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
