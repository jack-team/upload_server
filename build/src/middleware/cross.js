"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crossHeader = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Folder,Accept,X-Requested-With'
};
exports.default = async (ctx, next) => {
    for (let key in crossHeader) {
        ctx.set(key, crossHeader[key]);
    }
    if (ctx.method === `OPTIONS`) {
        ctx.status = 204;
    }
    await next();
};
//# sourceMappingURL=cross.js.map