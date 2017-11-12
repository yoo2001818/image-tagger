import mergeEntities from '../../util/mergeEntities';

export default function tagEntityReducer(state = {}, action) {
  if (action.payload == null) return state;
  if (action.payload.entities == null) return state;
  if (action.payload.entities.tag == null) return state;
  return mergeEntities(state, action.payload.entities.tag);
}
