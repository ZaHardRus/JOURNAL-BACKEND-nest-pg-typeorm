import {v2} from 'cloudinary';

export const CloudinaryProvider = {
    provide: "Cloudinary",
    useFactory: (): any => {
        return v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_SECRET_KEY,
        });
    },
};