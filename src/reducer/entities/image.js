import createEntitiesReducer from './entities';
import checkModified from '../../util/checkModified';
import getEntry from '../../util/getEntry';
import { FETCH, PATCH, RESET, SET, ADD_TAG, REMOVE_TAG, SET_TAG,
  UNDO, REDO, DESTROY } from '../../action/image';

export function imageEntityReducer(state = {
  undoList: [],
  redoList: [],
  imageTags: [],
}, action) {
  const undoList = (action.meta && action.meta.undoable)
    ? (state.undoList || []).concat(state.modified) : (state.undoList || []);
  const redoList = (action.meta && action.meta.undoable)
    ? [] : (state.redoList || []);
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
        undoList: [],
        redoList: [],
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
        undoList,
        redoList,
      });
    case ADD_TAG:
      return Object.assign({}, state, {
        modified: checkModified(state, {
          imageTags: getEntry(state, 'imageTags').concat(action.payload.data),
        }),
        undoList,
        redoList,
      });
    case REMOVE_TAG:
      return Object.assign({}, state, {
        modified: checkModified(state, {
          imageTags: getEntry(state, 'imageTags')
            .filter((_, i) => i !== action.payload.tagId),
        }),
        undoList,
        redoList,
      });
    case SET_TAG:
      return Object.assign({}, state, {
        modified: checkModified(state, {
          imageTags: getEntry(state, 'imageTags')
            .map((v, i) => i === action.payload.tagId
              ? action.payload.data : v),
        }),
        undoList,
        redoList,
      });
    case UNDO:
      if (state.undoList.length === 0) return state;
      return Object.assign({}, state, {
        modified: state.undoList[state.undoList.length - 1],
        undoList: state.undoList.slice(0, state.undoList.length - 1),
        redoList: state.redoList.concat([state.modified]),
      });
    case REDO:
      if (state.redoList.length === 0) return state;
      return Object.assign({}, state, {
        modified: state.redo[state.redoList.length - 1],
        undoList: state.undoList.concat([state.modified]),
        redoList: state.redoList.slice(0, state.redoList.length - 1),
      });
    default:
      return state;
  }
}

export default createEntitiesReducer('image', imageEntityReducer);
