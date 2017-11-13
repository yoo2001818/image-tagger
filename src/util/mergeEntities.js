export default function mergeEntities(state = {}, action, name) {
  if (action.payload == null) return state;
  if (action.payload.entities == null) return state;
  if (action.payload.entities[name] == null) return state;
  let entities = action.payload.entities[name];
  let output = Object.assign({}, state);
  for (let key in entities) {
    output[key] = Object.assign({}, state[key], entities[key]);
  }
  return output;
}
