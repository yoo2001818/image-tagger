import mergeEntities from '../../util/mergeEntities';

export default function imageEntityReducer(state = {}, action) {
  return mergeEntities(state, action, 'image');
}
