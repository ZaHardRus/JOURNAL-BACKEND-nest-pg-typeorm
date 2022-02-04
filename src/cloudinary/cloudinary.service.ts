import {Inject, Injectable} from '@nestjs/common';
import {UploadApiErrorResponse, UploadApiResponse, v2} from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    constructor(@Inject('Cloudinary') private cloudinary) {
    }

    async uploadImage(file: Express.Multer.File): Promise<any | UploadApiErrorResponse> {
        const data = new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            toStream(file.buffer).pipe(upload);
        });
        return data.then(data=>data['secure_url']).then(data=>({
            "success" : 1,
            "file": {
                "url" : data,
            }
        }))
    }
}