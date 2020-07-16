"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const proxy_1 = __importDefault(require("./proxy"));
const local_1 = __importDefault(require("./local"));
const path_1 = __importDefault(require("./../../utils/path"));
const services = __importStar(require("./../../services"));
const fileType_1 = __importDefault(require("./../../utils/fileType"));
const uploadPath = path_1.default(`/public`);
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
        const url = (await services.qiNiu(file));
        ctx.body = {
            code: 200,
            data: { url: url }
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