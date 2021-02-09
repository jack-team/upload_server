import Router from 'koa-router';

import * as crts from './../controllers';

const router = new Router();

/*渲染首页*/
router.get(`/`, crts.home);

/*上传*/
router.put(`/`, ...crts.upload);
router.post(`/`, ...crts.upload);

/*通过md5获取文件*/
router.get(`/file`, crts.file);
router.post(`/file`, crts.file);

export default router;
