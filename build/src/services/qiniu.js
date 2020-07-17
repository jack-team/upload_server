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
const opts = {
    scope: qn_json_1.SCOPE
};
const config = (new qiniu_1.default.conf.Config());
const mac = (new qiniu_1.default.auth.digest.Mac(qn_json_1.ACCESS_KEY, qn_json_1.SECRET_KEY));
const putExtra = (new qiniu_1.default.resume_up.PutExtra());
var uploader = (new qiniu_1.default.form_up.FormUploader(config));
const bucketManager = (new qiniu_1.default.rs.BucketManager(mac, config));
const getToken = () => (new qiniu_1.default.rs.PutPolicy(opts).uploadToken(mac));
const staticUri = `http://static.yutao2012.com`;
/*上传到七牛云*/
exports.upload = (file) => (new Promise((resolve, reject) => {
    const { path, filename } = file;
    let search = ``;
    const isImg = (file.mimetype.includes('image/'));
    if (isImg) {
        const { width, height } = image_size_1.default.imageSize(path);
        search = `?w=${width}&h=${height}`;
    }
    ;
    const url = (`${staticUri}/${filename}${search}`);
    const uploadCallback = (e) => {
        if (!!e) {
            reject(e.message);
        }
        else {
            resolve(url);
        }
        /*删除文件*/
        if (fs_1.default.existsSync(path)) {
            fs_1.default.unlinkSync(path);
        }
    };
    /*上传*/
    uploader.putFile(getToken(), filename, path, putExtra, uploadCallback);
}));
/*获取文件信息*/
exports.stat = (fileName) => (new Promise((resolve) => {
    const searchCallback = (err, body, info) => {
        if (!!err)
            resolve(``);
        const { statusCode } = info;
        return statusCode === 200 ?
            resolve(`${staticUri}/${fileName}`) : resolve(``);
    };
    bucketManager.stat(qn_json_1.SCOPE, fileName, searchCallback);
}));
//# sourceMappingURL=qiniu.js.map