import * as schema from '../schema';
import { normalize } from 'normalizr';

function unwrapSchema(data) {
  if (Array.isArray(data)) {
    return data.map(v => unwrapSchema(v));
  } else if (typeof data === 'object') {
    let output = {};
    for (let key in data) {
      output[key] = unwrapSchema(data[key]);
    }
    return output;
  } else {
    if (schema[data] == null) throw new Error('Schema ' + data + ' not found');
    return schema[data];
  }
}

export const normalizeMiddleware = store => next => action => {
  if (action == null) return next(action);
  if (action.meta == null || action.meta.schema == null) return next(action);
  if (action.error || (action.meta && action.meta.pending)) return next(action);
  let schemaData = unwrapSchema(action.meta.schema);
  return next(Object.assign({}, action, {
    payload: normalize(action.payload, schemaData),
  }));
};

export default normalizeMiddleware;
