import mergeEntities from '../../util/mergeEntities';

export default function imageEntityReducer(state = {}, action) {
  if (action.payload == null) return state;
  if (action.payload.entities == null) return state;
  if (action.payload.entities.image == null) return state;
  return mergeEntities(state, action.payload.entities.image);
}
