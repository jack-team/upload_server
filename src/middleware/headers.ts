import {
    Next,
    Context
} from 'koa';

export default async (ctx: Context, next: Next) => {
    try {
        await next();
    }
    catch (e) {
        console.log(e)
    }
}