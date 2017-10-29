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
  const { nextId, isProcessed } = req.query;
  let query = Image.forge().orderBy('randomId', 'asc');
  if (isProcessed != null) {
    query = query.where('isProcessed', '=',
      ['1', 'true', 'yes'].includes(isProcessed));
  }
  if (nextId != null) {
    query = query.where('randomId', '<', nextId);
  }
  let items = (await query.fetchPage({ limit: 21 })).serialize();
  res.json({
    items: items.slice(0, 20),
    nextId: items[20] && items[20].randomId,
  });
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
