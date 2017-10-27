import Router from 'express-promise-router';
import { NotImplementedError } from './util/errors';
import scan from './util/scan';
import { Image } from '../db';

const router = new Router();

router.post('/scan', async(req, res) => {
  let count = await scan();
  res.json({ count });
});

router.get('/', async(req, res) => {
  const { next_id: nextId } = req.query;
  let query = Image.forge().orderBy('random_id', 'asc');
  if (nextId != null) {
    query = query.where('random_id', '<', nextId);
  }
  let result = await query.fetchPage({ limit: 20 });
  res.json(result);
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
