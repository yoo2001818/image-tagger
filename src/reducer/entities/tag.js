import createEntitiesReducer from './entities';
import { FETCH, PATCH, SET, DESTROY }
  from '../../action/tag';

export function tagEntityReducer(state = {}, action) {
  switch (action.type) {
    case FETCH:
    case PATCH:
      if (action.meta.pending || action.error) {
        return Object.assign({}, state, {
          pending: true,
        });
      }
      return Object.assign({}, state, {
        pending: false,
      });
    case DESTROY:
      if (action.meta.pending || action.error) {
        return Object.assign({}, state, {
          pending: true,
        });
      }
      return null;
    case SET:
      return Object.assign({}, state, action.payload.data);
    default:
      return state;
  }
}

export default createEntitiesReducer('tag', tagEntityReducer);
