import Router from 'express-promise-router';
import { NotImplementedError } from './util/errors';

const router = new Router();

router.get('/', (req, res) => {
  throw new NotImplementedError();
});

router.post('/', (req, res) => {
  throw new NotImplementedError();
});

router.get('/:id', (req, res) => {
  throw new NotImplementedError();
});

router.patch('/:id', (req, res) => {
  throw new NotImplementedError();
});

router.delete('/:id', (req, res) => {
  throw new NotImplementedError();
});

export default router;
