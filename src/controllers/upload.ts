import {
    Context,
    Request
} from 'koa';

import Muter, {
    File
} from 'koa-multer';

import path from './../utils/path';

const filename = (req: Request, file: File, cb: Function) => {
    const fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
}

const destination = (req: Request, file: File, cb: Function) => {
    cb(null, path(`/public`));
}

const options: any = {
    filename: filename,
    destination: destination
}

var upload = Muter({
    storage: Muter.diskStorage(options)
});

const uploadLink = (
    upload.single(`file`)
)

export default [uploadLink, (ctx: Context) => {
    ctx.body = `上传成功`
}];