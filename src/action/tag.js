import { createAction } from 'redux-actions';

import { genLoadList } from './list';
import api from './api';

export const SELECT = 'tag/select';
export const FETCH_LIST = 'tag/fetchList';
export const FETCH = 'tag/fetch';
export const PATCH = 'tag/patch';
export const RESET = 'tag/reset';
export const SET = 'tag/set';
export const DESTROY = 'tag/destroy';
export const POST = 'tag/post';

export const select = createAction(SELECT, id => ({ id }));

export const fetchList = createAction(FETCH_LIST,
  (name, filter, nextId) => ({ name, filter, nextId }),
  (name, filter, nextId) => ({
    name,
    filter,
    api: api('GET', '/tags',
      { query: Object.assign({}, filter, { nextId }) }),
    schema: { items: ['tag'] },
  }));

export const fetch = createAction(FETCH,
  id => ({ id }),
  id => ({ id, api: api('GET', `/tags/${id}`), schema: 'tag' }));

export const patch = createAction(PATCH,
  (id, data) => ({ id, data }),
  (id, data) => ({
    id,
    api: api('PATCH', `/tags/${id}`, { body: data }),
    schema: 'tag',
  }));

export const reset = createAction(RESET,
  () => ({}),
  (id) => ({ id }));

export const set = createAction(SET,
  (id, data) => ({ id, data }),
  (id, data) => ({ id }));

export const destroy = createAction(DESTROY,
  id => ({ id }),
  id => ({ id, api: api('DELETE', `/tags/${id}`), schema: 'tag' }));

export const post = createAction(POST,
  (data, id) => ({ id, data }),
  (data, id) => ({
    id,
    api: api('POST', '/tags', { body: data }),
    schema: 'tag',
  }));

export function loadList(name, filter, reset) {
  return (dispatch, getState) => {
    let res = genLoadList(getState().tag.list,
      name, filter, reset, fetchList);
    if (res != null) return dispatch(res);
    return Promise.resolve();
  };
}

export function load(id) {
  return (dispatch, getState) => {
    let { tags } = getState().entities;
    if (tags[id] == null) return dispatch(fetch(id));
    return Promise.resolve();
  };
}

export function save(id) {
  return (dispatch, getState) => {
    let { tags } = getState().entities;
    if (tags[id].dirty) return dispatch(patch(id, tags[id]));
    return Promise.resolve();
  };
}
