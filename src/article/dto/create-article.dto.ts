import {IsArray, IsOptional, IsString} from "class-validator";

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsArray()
    body: Array<any>;

    @IsOptional()
    @IsArray()
    tags: string;
}
