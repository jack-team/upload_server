import {
    Context
} from 'koa';

export default (ctx: Context) => {
    ctx.render(`site`);
}