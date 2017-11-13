import listReducer from './list';
import { FETCH_LIST } from '../action/image';

export default function imageReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_LIST:
      return listReducer(state, action);
    default:
      return state;
  }
}

export function imageEntryReducer(state = {}, action) {
  if (action.error && action.meta.status === 404) {
    return Object.assign({}, state, { notExists: true });
  }
  if (action.error || action.meta.pending) return state;
  return Object.assign({}, state, action.payload, {
    pending: false, dirty: false });
}
