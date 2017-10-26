import Router from 'express-promise-router';
import { NotImplementedError } from './util/errors';

const router = new Router();

router.post('/scan', (req, res) => {
  throw new NotImplementedError();
});

router.get('/', (req, res) => {
  throw new NotImplementedError();
});

router.get('/:id', (req, res) => {
  throw new NotImplementedError();
});

router.patch('/:id', (req, res) => {
  throw new NotImplementedError();
});

router.get('/:id/tags', (req, res) => {
  throw new NotImplementedError();
});

router.put('/:id/tags', (req, res) => {
  throw new NotImplementedError();
});

router.delete('/:id/tags', (req, res) => {
  throw new NotImplementedError();
});

router.get('/:id/tags/:tagId', (req, res) => {
  throw new NotImplementedError();
});

router.patch('/:id/tags/:tagId', (req, res) => {
  throw new NotImplementedError();
});

router.delete('/:id/tags/:tagId', (req, res) => {
  throw new NotImplementedError();
});

export default router;
