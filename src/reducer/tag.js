import listReducer from './list';
import { FETCH_LIST, POST, DESTROY } from '../action/tag';

export default function tagReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_LIST:
      return listReducer(state, action);
    case POST:
      if (action.error) return state;
      if (action.meta && action.meta.pending) return state;
      if (state.main == null) return state;
      return Object.assign({}, state, {
        main: Object.assign({}, state.main, {
          items: state.main.items.concat([action.payload.result]),
        }),
      });
    case DESTROY:
      if (action.error) return state;
      if (action.meta && action.meta.pending) return state;
      if (state.main == null) return state;
      return Object.assign({}, state, {
        main: Object.assign({}, state.main, {
          items: state.main.items.filter(v => v !== action.meta.id),
        }),
      });
    default:
      return state;
  }
}

export function tagEntryReducer(state = {}, action) {
  if (action.error && action.meta.status === 404) {
    return Object.assign({}, state, { notExists: true });
  }
  if (action.error || action.meta.pending) return state;
  return Object.assign({}, state, action.payload, { pending: false });
}
