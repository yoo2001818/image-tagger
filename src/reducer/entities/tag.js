import createEntitiesReducer from './entities';
import checkModified from '../../util/checkModified';
import { POST, FETCH, PATCH, RESET, SET, DESTROY }
  from '../../action/tag';

export function tagEntityReducer(state = {}, action) {
  switch (action.type) {
    case FETCH:
    case PATCH:
    case POST:
      if (action.meta.pending || action.error) {
        return Object.assign({}, state, {
          pending: true,
        });
      }
      return Object.assign({}, state, {
        pending: false,
        modified: null,
      });
    case DESTROY:
      if (action.meta.pending || action.error) {
        return Object.assign({}, state, {
          pending: true,
        });
      }
      return null;
    case RESET:
      return Object.assign({}, state, {
        modified: null,
      });
    case SET:
      return Object.assign({}, state, {
        modified: checkModified(state, action.payload.data),
      });
    default:
      return state;
  }
}

export default createEntitiesReducer('tag', tagEntityReducer);
