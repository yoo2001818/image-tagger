import Router from 'express-promise-router';

import middleware from './middleware';
import errorHandler from './middleware/errorHandler';

import tags from './tags';
import images from './images';

const router = new Router();
router.use(middleware);

router.use('/tags', tags);
router.use('/images', images);

router.use(errorHandler);

export default router;
