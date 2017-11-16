import createEntitiesReducer from './entities';
import { FETCH, PATCH, SET, ADD_TAG, REMOVE_TAG, SET_TAG, DESTROY }
  from '../../action/image';

export function imageEntityReducer(state = {
  imageTags: [],
}, action) {
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
    case ADD_TAG:
      return Object.assign({}, state, {
        imageTags: state.imageTags.concat(action.payload.data),
      });
    case REMOVE_TAG:
      return Object.assign({}, state, {
        imageTags: state.imageTags.filter((_, i) => i !== action.payload.tagId),
      });
    case SET_TAG:
      return Object.assign({}, state, {
        imageTags: state.imageTags.map(
          (v, i) => i === action.payload.tagId ? action.payload.data : v),
      });
    default:
      return state;
  }
}

export default createEntitiesReducer('images', imageEntityReducer);
