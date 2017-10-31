import Router from 'express-promise-router';
import { NotImplementedError, NotFoundError } from './util/errors';
import scan from './util/scan';
import cast from './util/cast';
import { Image } from '../db';

const router = new Router();

router.post('/scan', async(req, res) => {
  let count = await scan();
  res.json({ count });
});

router.get('/', async(req, res) => {
  const args = cast({
    nextId: 'number',
    isProcessed: 'boolean',
    desc: 'boolean',
  }, req.query);
  let query = Image.forge().orderBy('randomId', args.desc ? 'desc' : 'asc');
  if (args.isProcessed != null) {
    query = query.where('isProcessed', '=', args.isProcessed);
  }
  if (args.nextId != null) {
    query = query.where('randomId', args.desc ? '>' : '<', args.nextId);
  }
  let items = (await query.fetchPage({
    limit: 20, withRelated: ['imageTags', 'imageTags.tag'],
  })).serialize();
  res.json({
    items: items,
    nextId: items[19] && items[19].randomId,
  });
});

router.param('imageId', async(req, res, next, id) => {
  req.image = await Image.forge({ id })
    .fetch({ withRelated: ['imageTags', 'imageTags.tag'] });
  if (req.image == null) {
    throw new NotFoundError();
  }
  next();
});

router.get('/:imageId', (req, res) => {
  res.json(req.image);
});

router.patch('/:imageId', (req, res) => {
  throw new NotImplementedError();
});

router.get('/:imageId/tags', (req, res) => {
  throw new NotImplementedError();
});

router.put('/:imageId/tags', (req, res) => {
  throw new NotImplementedError();
});

export default router;
