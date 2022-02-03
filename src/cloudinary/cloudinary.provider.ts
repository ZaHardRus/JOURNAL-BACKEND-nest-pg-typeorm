import {v2} from 'cloudinary';

export const CloudinaryProvider = {
    provide: "Cloudinary",
    useFactory: (): any => {
        return v2.config({
            cloud_name: 'didcoqrgd',
            api_key: '412332545554378',
            api_secret: 'K19zxWf1rgCtuw8nxtKQU8HFz1o',
        });
    },
};