import {
  Next,
  Context
} from 'koa';

const crossHeader: any = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Folder,Accept,X-Requested-With'
};

export default async (ctx: Context, next: Next) => {
  Object.keys(crossHeader).forEach((key: string) => {
    ctx.set(key, crossHeader[key]);
  })
  if (ctx.method === `OPTIONS`) ctx.status = 204;
  await next();
}
