import {
    Next,
    Context
} from 'koa';

export default async (ctx: Context, next: Next) => {
    await next();
}