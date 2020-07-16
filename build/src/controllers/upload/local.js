"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const koa_multer_1 = __importDefault(require("koa-multer"));
const path_1 = __importDefault(require("./../../utils/path"));
const setFileName = (req, file, cb) => {
    cb(null, file.originalname);
};
const setDestination = (req, file, cb) => {
    const { folder } = req.headers;
    const folderPath = (path_1.default(`/public/${folder}`));
    /*不存在则创建*/
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath);
    }
    cb(null, folderPath);
};
const options = {
    filename: setFileName,
    destination: setDestination
};
const upload = koa_multer_1.default({
    storage: koa_multer_1.default.diskStorage(options)
});
exports.default = upload.array(`file`, 10);
//# sourceMappingURL=local.js.map