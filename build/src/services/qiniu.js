"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stat = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const qiniu_1 = __importDefault(require("qiniu"));
const image_size_1 = __importDefault(require("image-size"));
const qn_json_1 = require("./../../config/qn.json");
const config = (new qiniu_1.default.conf.Config());
const mac = (new qiniu_1.default.auth.digest.Mac(qn_json_1.ACCESS_KEY, qn_json_1.SECRET_KEY));
const putExtra = (new qiniu_1.default.resume_up.PutExtra());
var uploader = (new qiniu_1.default.resume_up.ResumeUploader(config));
const bucketManager = (new qiniu_1.default.rs.BucketManager(mac, config));
const getToken = () => {
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const opts = { scope: qn_json_1.SCOPE, deadline: deadline };
    return new qiniu_1.default.rs.PutPolicy(opts).uploadToken(mac);
};
const staticUri = `http://static.yutao2012.com`;
/*上传到七牛云*/
exports.upload = (file) => (new Promise((resolve, reject) => {
    const { path, filename, mimetype } = file;
    let fileUrl = `${staticUri}/${filename}`;
    const uploadCallback = (err, body, info) => {
        const { statusCode } = info;
        if (!!err || statusCode !== 200) {
            return reject('文件上传失败');
        }
        const isImage = mimetype.includes('image/');
        /*
        * 如果是图片则加上图片的尺寸
        * */
        if (isImage) {
            const { width, height } = image_size_1.default.imageSize(path);
            fileUrl = `${fileUrl}?width=${width}&height=${height}`;
        }
        resolve(fileUrl);
        if (fs_1.default.existsSync(path))
            fs_1.default.unlinkSync(path);
    };
    uploader.putFile(getToken(), filename, path, putExtra, uploadCallback);
}));
/*
* 获取文件是否存在
* @param fileName 文件名
* */
exports.stat = (fileName) => (new Promise((resolve) => {
    const searchCallback = (err, body, { statusCode }) => {
        const hasFile = !err && statusCode === 200;
        resolve(hasFile ? `${staticUri}/${fileName}` : '');
    };
    bucketManager.stat(qn_json_1.SCOPE, fileName, searchCallback);
}));
//# sourceMappingURL=qiniu.js.map