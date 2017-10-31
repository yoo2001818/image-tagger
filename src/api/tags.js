import Router from 'express-promise-router';
import { NotImplementedError } from './util/errors';
import cast from './util/cast';
import pick from './util/pick';
import { Tag } from '../db';

const router = new Router();

router.get('/', async(req, res) => {
  const args = cast({
    nextId: 'number',
    name: 'string',
    desc: 'boolean',
  }, req.query);
  let query = Tag.forge().orderBy('id', args.desc ? 'desc' : 'asc');
  if (args.name != null) {
    query = query.where('name', 'LIKE', args.name);
  }
  if (args.nextId != null) {
    query = query.where('id', args.desc ? '>' : '<', args.nextId);
  }
  let items = (await query.fetchPage({
    limit: 20, withRelated: ['parents'],
  })).serialize({ omitPivot: true });
  res.json({
    items: items,
    nextId: items[19] && items[19].randomId,
  });
});

router.post('/', async(req, res) => {
  let body = pick(['name', 'color', 'isGlobal'], req.body);
  let tag = new Tag(body);
  await tag.save();
  // If children, parents is set, apply them.
  if (req.body.children) {
    await tag.related('children').attach(req.body.children);
  }
  if (req.body.parents) {
    await tag.related('parents').attach(req.body.parents);
  }
  await tag.load(['children', 'parents']);
  res.json(tag.serialize({ omitPivot: true }));
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
