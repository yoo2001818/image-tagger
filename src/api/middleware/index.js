import { Router } from 'express';
import bodyParser from 'body-parser';

const router = new Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

export default router;
