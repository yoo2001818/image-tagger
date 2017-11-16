import mergeEntities from '../../util/mergeEntities';

export const createEntitiesReducer = (
  name, reducer, getId = action => action.meta && action.meta.id,
) => (state = {}, action) => {
  // First, merge entities.
  let newState = mergeEntities(state, action, name);
  let id = getId(action);
  // Then, run reducer.
  if (id == null) return newState;
  // When the object is null, we have to be sure if the reducer actually
  // processes the action. To do that, we run reducer twice.
  let result;
  if (newState[id] == null) {
    let initialState = reducer(undefined, { type: '@@redux/init' });
    result = reducer(initialState, action);
    if (result === initialState) return newState;
  } else {
    result = reducer(newState[id], action);
    if (result === newState[id]) return newState;
    if (result === null) {
      let output = Object.assign({}, newState);
      delete output[id];
      return output;
    }
  }
  return Object.assign({}, newState, {
    [id]: result,
  });
};

export default createEntitiesReducer;
