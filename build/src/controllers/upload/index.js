"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const proxy_1 = __importDefault(require("./proxy"));
const local_1 = __importDefault(require("./local"));
const path_1 = __importDefault(require("./../../utils/path"));
const fileType_1 = __importDefault(require("./../../utils/fileType"));
const uploadPath = path_1.default(`/public/upload`);
const Success = async (ctx) => {
    const { folder: fileMd5 } = ctx.request.headers;
    const { merge, fileName } = ctx.req.body;
    if (!merge) {
        return ctx.body = {
            code: 200,
            data: {}
        };
    }
    const suffix = (fileType_1.default(fileName));
    const folder = (`${uploadPath}/${fileMd5}`);
    if (!fs_1.default.existsSync(folder)) {
        return ctx.body = {
            code: 10002,
            message: `文件不存在`
        };
    }
    const filePath = (`${uploadPath}/${fileMd5}.${suffix}`);
    /*创建文件*/
    fs_1.default.writeFileSync(filePath, ``);
    const chunks = fs_1.default.readdirSync(folder);
    /*合并文件*/
    chunks.sort().forEach((chunk) => {
        const chunkPath = `${folder}/${chunk}`;
        const fileContent = fs_1.default.readFileSync(chunkPath);
        fs_1.default.appendFileSync(filePath, fileContent);
        fs_1.default.unlinkSync(chunkPath);
    });
    /*删除零时文件夹*/
    fs_1.default.rmdirSync(folder);
    /*上传到七牛云*/
    const file = {
        path: filePath,
        filename: `${fileMd5}.${suffix}`,
        mimetype: mime_1.default.getType(filePath) || ``
    };
    try {
        // const url = (
        //   await services.qiNiu.upload(file)
        // )
        ctx.body = {
            code: 200,
            data: { url: `url` }
        };
    }
    catch (e) {
        ctx.body = {
            code: 500,
            message: `系统错误，请稍后再试一试!`
        };
    }
};
exports.default = [
    proxy_1.default, local_1.default, Success
];
//# sourceMappingURL=index.js.map