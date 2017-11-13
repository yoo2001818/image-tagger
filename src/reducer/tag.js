import listReducer from './list';
import { FETCH_LIST } from '../action/tag';

export default function tagReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_LIST:
      return listReducer(state, action);
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
