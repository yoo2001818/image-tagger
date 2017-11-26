import createEntitiesReducer from './entities';
import checkModified from '../../util/checkModified';
import getEntry from '../../util/getEntry';
import { FETCH, PATCH, RESET, SET, ADD_TAG, REMOVE_TAG, SET_TAG, DESTROY }
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
    case ADD_TAG:
      return Object.assign({}, state, {
        modified: checkModified(state, {
          imageTags: getEntry(state, 'imageTags').concat(action.payload.data),
        }),
      });
    case REMOVE_TAG:
      return Object.assign({}, state, {
        modified: checkModified(state, {
          imageTags: getEntry(state, 'imageTags')
            .filter((_, i) => i !== action.payload.tagId),
        }),
      });
    case SET_TAG:
      return Object.assign({}, state, {
        modified: checkModified(state, {
          imageTags: getEntry(state, 'imageTags')
            .map((v, i) => i === action.payload.tagId
              ? action.payload.data : v),
        }),
      });
    default:
      return state;
  }
}

export default createEntitiesReducer('image', imageEntityReducer);
