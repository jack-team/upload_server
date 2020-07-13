import Router from 'koa-router';

import * as crts from './../controllers';

const router = new Router();

/*渲染首页*/
router.get(`/`, crts.home);

/*上传*/
router.put(`/`, ...crts.upload);
router.post(`/`, ...crts.upload);

export default router;