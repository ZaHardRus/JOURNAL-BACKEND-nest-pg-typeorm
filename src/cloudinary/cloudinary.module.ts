import {Module} from '@nestjs/common';
import {CloudinaryProvider} from './cloudinary.provider';
import {CloudinaryService} from './cloudinary.service';
import {CloudinaryController} from "./cloudinary.controller";

@Module({
    controllers: [CloudinaryController],
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule {
}