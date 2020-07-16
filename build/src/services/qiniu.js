"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const qiniu_1 = __importDefault(require("qiniu"));
const image_size_1 = __importDefault(require("image-size"));
const qn_json_1 = __importDefault(require("./../../config/qn.json"));
const opts = {
    scope: qn_json_1.default.SCOPE
};
const mac = new qiniu_1.default.auth.digest.Mac(qn_json_1.default.ACCESS_KEY, qn_json_1.default.SECRET_KEY);
const putExtra = (new qiniu_1.default.resume_up.PutExtra());
var uploader = (new qiniu_1.default.form_up.FormUploader());
const getToken = () => (new qiniu_1.default.rs.PutPolicy(opts).uploadToken(mac));
const staticUri = `http://static.yutao2012.com`;
/*上传到七牛云*/
exports.default = (file) => (new Promise((resolve, reject) => {
    const { path, filename } = file;
    let search = ``;
    const isImg = (file.mimetype.
        includes('image/'));
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
//# sourceMappingURL=qiniu.js.map