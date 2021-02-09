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

    const { path, filename, mimetype } = file;

    let fileUrl = `${staticUri}/${filename}`;

    const uploadCallback = (err: Error, body: any, { statusCode }: any) => {
      if (!!err || statusCode !== 200) {
        return reject('文件上传失败');
      }

      const isImage = mimetype.includes('image/');

      /*
      * 如果是图片则加上图片的尺寸
      * */
      if (isImage) {
        const { width, height } = sizeOf.imageSize(path);
        fileUrl = `${fileUrl}?width=${width}&height=${height}`
      }

      resolve(fileUrl);

      if (fs.existsSync(path)) fs.unlinkSync(path);
    };

    uploader.putFile(getToken(), filename, path, putExtra, uploadCallback);
  })
);

/*
* 获取文件是否存在
* @param fileName 文件名
* */
export const stat = (fileName: string) => (
  new Promise((resolve) => {
    const searchCallback = (err: any, body: any, { statusCode }: any) => {
      const hasFile = !err && statusCode === 200;
      resolve(hasFile ? `${staticUri}/${fileName}` : '');
    }
    bucketManager.stat(SCOPE, fileName, searchCallback);
  })
)
