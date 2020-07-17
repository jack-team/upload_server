import {
    Next,
    Context
} from 'koa';

export default async (ctx: Context, next: Next) => {
    try {
        await next();
    }
    catch (e) {
        ctx.body = {
            code: 500,
            message: `${e}`
        }
    }
}