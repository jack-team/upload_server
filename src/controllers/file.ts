import {
  Context
} from 'koa';

import fs from 'fs';

import path from './../utils/path';

import * as Services from './../services';

const uploadPath = path(`/public/upload`);

export default async (ctx: Context) => {
  const { md5, ext } = ctx.request.body;

  const fileName = `${md5}.${ext}`;

  const filePath = `${uploadPath}/${fileName}`;

  /*如果当前文件还在本地,删除文件*/
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  const url = await Services.qiNiu.stat(fileName);

  ctx.body = {
    code: 200,
    data: { url: url }
  }
}
