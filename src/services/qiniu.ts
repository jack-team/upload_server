import fs from 'fs';

import qiNiu from 'qiniu';

import sizeOf from 'image-size';

import {
    SCOPE,
    ACCESS_KEY,
    SECRET_KEY
} from './../../config/qn.json';

interface File {
    path: string;
    mimetype: string;
    filename: string;
}

const opts: any = {
    scope: SCOPE
}

const config: any = (
    new qiNiu.conf.Config()
);

config.zone = qiNiu.zone.Zone_z1;

const mac = (
    new qiNiu.auth.digest.Mac(
        ACCESS_KEY, SECRET_KEY
    )
);

const putExtra = (
    new qiNiu.resume_up.PutExtra()
);

var uploader = (
    new qiNiu.form_up.FormUploader(config)
);

const bucketManager = (
    new qiNiu.rs.BucketManager(mac, config)
);

const getToken = () => (
    new qiNiu.rs.PutPolicy(opts).uploadToken(mac)
);

const staticUri = `http://static.yutao2012.com`;

/*上传到七牛云*/
export const upload = (file: File) => (
    new Promise((resolve, reject) => {
        const {
            path,
            filename
        } = file;

        let search: string = ``;

        const isImg: boolean = (
            file.mimetype.includes('image/')
        );

        if (isImg) {
            const {
                width,
                height
            } = sizeOf.imageSize(path);
            search = `?w=${width}&h=${height}`;
        };

        const url: string = (
            `${staticUri}/${filename}${search}`
        );

        const uploadCallback = (e: Error) => {
            if (!!e) {
                reject(e.message);
            }
            else {
                resolve(url);
            }
            /*删除文件*/
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }
        };

        /*上传*/
        uploader.putFile(
            getToken(), filename, path,
            putExtra, uploadCallback
        );
    })
);

/*获取文件信息*/
export const stat = (fileName: string) => (
    new Promise((resolve) => {
        const searchCallback = (err: any, body: any, info: any) => {
            if (!!err) resolve(``);
            const { statusCode } = info;
            return statusCode === 200 ?
                resolve(`${staticUri}/${fileName}`):resolve(``);
        }
        bucketManager.stat(
            SCOPE, fileName, searchCallback
        );
    })
)