import mergeEntities from '../../util/mergeEntities';
import { FETCH, PATCH, SET, ADD_TAG, REMOVE_TAG, SET_TAG, DESTROY }
  from '../../action/image';

export default function imageEntityReducer(state = {}, action) {
  // First, merge entities.
  let newState = mergeEntities(state, action, 'image');
  // Then, run image reducer.
  if (action.meta.id == null) return newState;
  // When the object is null, we have to be sure if the reducer actually
  // processes the action. To do that, we run reducer twice.
  let result;
  if (newState[action.meta.id] == null) {
    let initialState = imageReducer(undefined, { type: '@@redux/init' });
    result = imageReducer(initialState, action);
    if (result === initialState) return newState;
  } else {
    result = imageReducer(newState[action.meta.id], action);
    if (result === newState[action.meta.id]) return newState;
    if (result === null) {
      let output = Object.assign({}, newState);
      delete output[action.meta.id];
      return output;
    }
  }
  return Object.assign({}, newState, {
    [action.meta.id]: result,
  });
}

export function imageReducer(state = {
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
        imageTags: state.imageTags.filter((_, i) => i !== action.id),
      });
    case SET_TAG:
      return Object.assign({}, state, {
        imageTags: state.imageTags.map(
          (v, i) => i === action.id ? action.payload.data : v),
      });
    default:
      return state;
  }
}
