import mergeEntities from '../../util/mergeEntities';
import { FETCH, PATCH, SET, ADD_TAG, REMOVE_TAG, SET_TAG, DESTROY, POST }
  from '../../action/image';

export default function imageEntityReducer(state = {}, action) {
  // First, merge entities.
  let newState = mergeEntities(state, action, 'image');
  // Then, run image reducer.
  if (action.meta.id == null) return newState;
  let result = imageReducer(newState[action.meta.id], action);
  if (result === newState[action.meta.id]) return newState;
  if (result === null) {
    let output = Object.assign({}, newState);
    delete output[action.meta.id];
    return output;
  }
  return Object.assign({}, newState, {
    [action.meta.id]: result,
  });
}

export function imageReducer(state = {}, action) {
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
    case POST:
    case SET:
    case ADD_TAG:
    case REMOVE_TAG:
    case SET_TAG:
    default:
      return state;
  }
}
