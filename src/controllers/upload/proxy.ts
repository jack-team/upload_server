import {
    Next,
    Context
} from 'koa';

const toM = (size: number) => (
    Math.ceil(size / 1024 / 1024)
);

export default async (ctx: Context, next: Next) => {
    const request = (
        ctx.request as any
    );

    const size = (
        request[`content-length`] || 0
    );

    if (toM(size) > 100) {
        return ctx.body = {
            code: 5001,
            message: `上传文件不能大于100M`
        }
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
}