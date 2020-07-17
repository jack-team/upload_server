"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (ctx, next) => {
    try {
        await next();
    }
    catch (e) {
        console.log(e);
    }
};
//# sourceMappingURL=headers.js.map