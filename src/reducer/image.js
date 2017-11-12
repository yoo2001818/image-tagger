import { normalizeListReducer } from './list';
import { FETCH_LIST, FETCH, PATCH,
  SET, ADD_TAG, REMOVE_TAG, SET_TAG } from '../action/image';

export default function imageReducer(state = {
  lists: {},
  entities: {},
}, action) {
  const { entities } = state;
  const { id } = action.meta || {};
  switch (action.type) {
    case FETCH_LIST:
      return normalizeListReducer(state, action, v => v.id);
    case FETCH:
    case PATCH:
    case SET:
    case ADD_TAG:
    case REMOVE_TAG:
    case SET_TAG:
      return Object.assign({}, state, {
        entities: Object.assign({}, entities, {
          [id]: imageEntryReducer(entities[id], action),
        }),
      });
    default:
      return state;
  }
}

export function imageEntryReducer(state = {}, action) {
  switch (action.type) {
    case PATCH:
    case FETCH:
      if (action.error && action.meta.status === 404) {
        return Object.assign({}, state, { notExists: true });
      }
      if (action.error || action.meta.pending) return state;
      return Object.assign({}, state, action.payload, {
        pending: false, dirty: false });
  }
}
