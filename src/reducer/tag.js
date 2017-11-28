import listReducer from './list';
import { SELECT, FETCH_LIST, POST, DESTROY } from '../action/tag';

export default function tagReducer(state = {
  list: {},
  selected: null,
}, action) {
  switch (action.type) {
    case SELECT:
      return Object.assign({}, state, {
        selected: action.payload.id,
      });
    case FETCH_LIST:
      return Object.assign({}, state, {
        list: listReducer(state.list, action),
      });
    case POST:
      if (action.error) return state;
      if (action.meta && action.meta.pending) return state;
      if (state.list.main == null) return state;
      return Object.assign({}, state, {
        list: Object.assign({}, state.list, {
          main: Object.assign({}, state.list.main, {
            items: state.list.main.items.concat([action.payload.result]),
          }),
        }),
      });
    case DESTROY:
      if (action.error) return state;
      if (action.meta && action.meta.pending) return state;
      if (state.list.main == null) return state;
      return Object.assign({}, state, {
        list: Object.assign({}, state.list, {
          main: Object.assign({}, state.list.main, {
            items: state.list.main.items.filter(v => v !== action.meta.id),
          }),
        }),
      });
    default:
      return state;
  }
}
