"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toM = (size) => (Math.ceil(size / 1024 / 1024));
exports.default = async (ctx, next) => {
    const request = ctx.request;
    const size = (request[`content-length`] || 0);
    if (toM(size) > 100) {
        return ctx.body = {
            code: 5001,
            message: `上传文件不能大于100M`
        };
    }
    try {
        await next();
    }
    catch (e) {
        ctx.body = {
            code: 500,
            message: `${e}`
        };
    }
};
//# sourceMappingURL=proxy.js.map