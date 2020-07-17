import {
    Request
} from 'koa';

import fs from 'fs';

import Muter from 'koa-multer';

import path from './../../utils/path';

const setFileName = (
    req: Request,
    file: Muter.File,
    cb: Function
) => {
    cb(null, file.originalname)
};

const setDestination = (
    req: Request,
    file: Muter.File,
    cb: Function
) => {
    const {
        folder
    } = req.headers;

    const uploadPath = (
        path(`/public/upload`)
    )

    /*创建上传文件夹*/
    if(!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath)
    }

    /*零时文件夹*/
    const folderPath = (
        `${uploadPath}/${folder}`
    );

    /*不存在则创建*/
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
    }

    cb(null, folderPath);
};

const options: any = {
    filename: setFileName,
    destination: setDestination
};

const upload = Muter({
    storage: Muter.diskStorage(options)
});

export default upload.array(
    `file`, 10
);