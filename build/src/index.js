"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_ejs_1 = __importDefault(require("koa-ejs"));
const koa_body_1 = __importDefault(require("koa-body"));
const router_1 = __importDefault(require("./router"));
const path_1 = __importDefault(require("./utils/path"));
const cross_1 = __importDefault(require("./middleware/cross"));
const headers_1 = __importDefault(require("./middleware/headers"));
const koa_static_cache_1 = __importDefault(require("koa-static-cache"));
const app = new koa_1.default();
app.use(cross_1.default);
app.use(headers_1.default);
app.use(koa_body_1.default());
/*配置静态路径*/
const staticConfig = {
    gzip: true,
    prefix: `/static`,
    maxAge: 365 * 24 * 60 * 60
};
app.use(koa_static_cache_1.default(path_1.default(`/static`), staticConfig));
/*配置模板引擎*/
koa_ejs_1.default(app, {
    cache: true,
    debug: true,
    layout: false,
    viewExt: `html`,
    root: path_1.default(`/src/views`)
});
app.use(router_1.default.routes());
app.use(router_1.default.allowedMethods());
app.listen(5600, () => {
    console.log(`server on port: 5600`);
});
//# sourceMappingURL=index.js.map