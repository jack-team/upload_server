import {
    Context
} from 'koa';

import fs from 'fs';

import mime from 'mime';

import Proxy from './proxy';

import Receive from './local';

import path from './../../utils/path';

import * as services from './../../services';

import fileType from './../../utils/fileType';

const uploadPath = path(`/public/upload`);

const Success = async (ctx: Context) => {
    const {
        folder: fileMd5
    } = ctx.request.headers;

    const {
        merge,
        fileName
    } = (ctx.req as any).body;

    if (!merge) {
        return ctx.body = {
            code: 200,
            data: {}
        }
    }

    const suffix = (
        fileType(fileName)
    );

    const folder = (
        `${uploadPath}/${fileMd5}`
    )

    if (!fs.existsSync(folder)) {
        return ctx.body = {
            code: 10002,
            message: `文件不存在`
        }
    }

    const filePath = (
        `${uploadPath}/${fileMd5}.${suffix}`
    );

    /*创建文件*/
    fs.writeFileSync(filePath, ``);

    const chunks = fs.readdirSync(folder);

    /*合并文件*/
    chunks.sort().forEach((chunk: string) => {
        const chunkPath = `${folder}/${chunk}`;
        const fileContent = fs.readFileSync(chunkPath);
        fs.appendFileSync(filePath, fileContent);
        fs.unlinkSync(chunkPath);
    });

    /*删除零时文件夹*/
    fs.rmdirSync(folder);

    /*上传到七牛云*/
    const file: any = {
        path: filePath,
        filename: `${fileMd5}.${suffix}`,
        mimetype: mime.getType(filePath) || ``
    }

    try {
        const url = (
            await services.qiNiu(file)
        )
        ctx.body = {
            code: 200,
            data: {url: url}
        }
    }
    catch (e) {
        ctx.body = {
            code: 500,
            message: `系统错误，请稍后再试一试!`
        }
    }
}

export default [
    Proxy, Receive, Success
];