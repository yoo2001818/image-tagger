import listReducer from './list';
import { FETCH_LIST } from '../action/image';

export default function imageReducer(state = { list: {} }, action) {
  switch (action.type) {
    case FETCH_LIST:
      return Object.assign({}, state, {
        list: listReducer(state.list, action),
      });
    default:
      return state;
  }
}
