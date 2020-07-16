import Koa from 'koa';
import koaEjs from 'koa-ejs';
import koaBody from 'koa-body';
import router from './router';
import path from './utils/path';
import cross from './middleware/cross';
import headers from './middleware/headers';
import staticCache from 'koa-static-cache';

const app = new Koa();

app.use(cross);

app.use(headers);

app.use(koaBody());

/*配置静态路径*/
const staticConfig = {
    gzip: true,
    prefix: `/static`,
    maxAge: 365 * 24 * 60 * 60
} as staticCache.Options;

app.use(staticCache(
    path(`/static`), staticConfig
));

/*配置模板引擎*/
koaEjs(app, {
    cache: true,
    debug: true,
    layout: false,
    viewExt: `html`,
    root: path(`/src/views`)
});

app.use(router.routes());
app.use(router.allowedMethods());

const lister = () => {
    console.log(`server on port: 5600`);
}

const server = app.listen(5600 ,lister);

server.setTimeout(5 * 60 * 1000);
