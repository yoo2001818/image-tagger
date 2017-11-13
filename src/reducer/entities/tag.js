import mergeEntities from '../../util/mergeEntities';

export default function tagEntityReducer(state = {}, action) {
  return mergeEntities(state, action, 'tag');
}
