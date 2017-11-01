import Router from 'express-promise-router';
import { NotImplementedError, NotFoundError } from './util/errors';
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

router.param('tagId', async(req, res, next, id) => {
  req.tag = await Tag.forge({ id })
    .fetch({ withRelated: ['children', 'parents'] });
  if (req.tag == null) {
    throw new NotFoundError();
  }
  next();
});

router.get('/:tagId', (req, res) => {
  res.json(req.tag.serialize({ omitPivot: true }));
});

router.patch('/:tagId', (req, res) => {
  throw new NotImplementedError();
});

router.delete('/:tagId', (req, res) => {
  throw new NotImplementedError();
});

export default router;
