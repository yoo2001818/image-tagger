import Router from 'express-promise-router';
import { NotFoundError } from './util/errors';
import cast from './util/cast';
import pick from './util/pick';
import { knex, Tag } from '../db';

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
  // TODO Check if parents is array
  if (req.body.parents) {
    await tag.related('parents').attach(
      req.body.parents.map(id => ({ parent_id: id, derivedCount: -1 })));
    // Attach all parents' parents to the children itself; This should be done
    // using raw knex query.
    await knex('tags_children').insert(function() {
      return this.from('tags_children AS c')
        .whereIn('c.childId', req.body.parents)
        .groupBy('c.parentId')
        .select('c.parentId AS parentId', knex.raw('? AS childId', tag.id))
        .countDistinct('c.childId as derivedCount');
    });
  }
  if (req.body.children) {
    await tag.related('children').attach(
      req.body.children.map(id => ({ child_id: id, derivedCount: -1 })));
    // Attach all the tag's parents to the children. This should be done in
    // the following order:
    // 1. Join all parents of the tag and the children list - this can be done
    //    SQL, or JS side.
    // 2. Insert them, and increase derivedCount if the derivedCount is 0 when
    //    it conflicts.
    // Three implementations are possible:
    // - Use UPSERT query. However, this isn't supported in all databases.
    // - Run UPDATE with inner join, then INSERT with left exclusive join.
    // - Get all list with left join first, then separate two queries.
    // First one is fastest, but should be avoid due to compatibility.
    // Second one runs join twice. If the database is large enough, this can be
    // a problem.
    // Third one requires transmitting data from/to the server, twice. This can
    // be expensive if the network bandwidth is small.
    // Let's implement second one - however, it's not possible to update the
    // rows using it because it uses compound priamry key.
    // So let's execute the query for each children.
    for (let childId of tag.body.children) {
      await knex('tags_children').increment('derivedCount', 1)
        .whereIn('parentId', function() {
          return this.from('tags_children AS p')
            .where('p.childId', '=', tag.id)
            .select('p.parentId');
        })
        .andWhere('childId', '=', childId)
        .andWhere('derivedCount', '!=', -1);
      await knex('tags_children').insert(function() {
        return this.from('tags_children AS p')
          .where('p.childId', '=', tag.id)
          .leftJoin('tags_children AS c', function() {
            return this.on('c.parentId', '=', 'p.parentId')
              .andOn('c.childId', '=', childId);
          })
          .whereNull('c.childId')
          .select('p.parentId AS parentId', knex.raw('? AS childId', childId),
            knex.raw('1 AS derivedCount'));
      });
    }
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

router.patch('/:tagId', async(req, res) => {
  let body = pick(['name', 'color', 'isGlobal'], req.body);
  await req.tag.save(body);
  res.json(req.tag.serialize({ omitPivot: true }));
});

router.delete('/:tagId', async(req, res) => {
  await req.tag.destroy();
  res.json({});
});

export default router;
