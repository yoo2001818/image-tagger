import { normalizeListReducer } from './list';
import { FETCH_LIST, FETCH, PATCH, DESTROY, POST } from '../action/tag';

export default function tagReducer(state = {
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
      return Object.assign({}, state, {
        entities: Object.assign({}, entities, {
          [id]: tagEntryReducer(entities[id], action),
        }),
      });
    case DESTROY:
      return Object.assign({}, state, {
        lists: {},
        entities: Object.assign({}, entities, {
          [id]: tagEntryReducer(entities[id], action),
        }),
      });
    case POST:
      if (action.meta.pending) return state;
      return Object.assign({}, state, {
        lists: {},
        entities: Object.assign({}, entities, {
          [action.payload.id]:
            tagEntryReducer(entities[action.payload.id], action),
        }),
      });
    default:
      return state;
  }
}

export function tagEntryReducer(state = {}, action) {
  switch (action.type) {
    case PATCH:
    case FETCH:
    case POST:
      if (action.error && action.meta.status === 404) {
        return Object.assign({}, state, { notExists: true });
      }
      if (action.error || action.meta.pending) return state;
      return Object.assign({}, state, action.payload, { pending: false });
  }
}
