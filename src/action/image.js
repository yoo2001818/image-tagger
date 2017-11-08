import { createAction } from 'redux-actions';

import { genLoadList } from './list';
import api from './api';

export const FETCH_LIST = 'image/fetchList';
export const FETCH = 'image/fetch';
export const PATCH = 'image/patch';
export const DESTROY = 'image/destroy';
export const POST = 'image/post';

export const fetchList = createAction(FETCH_LIST,
  (name, filter, nextId) => ({ name, filter, nextId }),
  (name, filter, nextId) => ({
    name,
    filter,
    api: api('GET', '/images',
      { query: Object.assign({}, filter, { nextId }) }),
  }));

export const fetch = createAction(FETCH,
  id => ({ id }),
  id => ({ id, api: api('GET', `/images/${id}`) }));

export const patch = createAction(PATCH,
  (id, data) => ({ id, data }),
  (id, data) => ({ id, api: api('PATCH', `/images/${id}`, { body: data }) }));

export function loadList(name, filter, reset) {
  return (dispatch, getState) => {
    let res = genLoadList(getState().image, name, filter, reset, fetchList);
    if (res != null) return dispatch(res);
    return Promise.resolve();
  };
}

export function load(id) {
  return (dispatch, getState) => {
    let { entities } = getState().image;
    if (entities[id] == null) return dispatch(fetch(id));
    return Promise.resolve();
  };
}
