"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (ctx, next) => {
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
//# sourceMappingURL=headers.js.map