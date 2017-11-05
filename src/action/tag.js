import { createAction } from 'redux-actions';

import { genLoadList } from './list';
import api from './api';

export const FETCH_LIST = 'tag/fetchList';
export const FETCH = 'tag/fetch';
export const PATCH = 'tag/patch';
export const DESTROY = 'tag/destroy';
export const POST = 'tag/post';

export const fetchList = createAction(FETCH_LIST,
  (name, filter, next) => ({ name, filter, next }),
  (name, filter, next) => ({
    name,
    filter,
    api: api('GET', '/tags',
      { query: Object.assign({}, filter, { nextId: next }) }),
  }));

export const fetch = createAction(FETCH,
  id => ({ id }),
  id => ({ id, api: api('GET', `/tags/${id}`) }));

export const patch = createAction(PATCH,
  (id, data) => ({ id, data }),
  (id, data) => ({ id, api: api('PATCH', `/tags/${id}`, { body: data }) }));

export const destroy = createAction(DESTROY,
  id => ({ id }),
  id => ({ id, api: api('DELETE', `/tags/${id}`) }));

export const post = createAction(POST,
  (data) => ({ data }),
  (data) => ({ api: api('POST', '/tags', { body: data }) }));

export function loadList(name, filter, reset) {
  return (dispatch, getState) => {
    let res = genLoadList(getState().tag, name, filter, reset, fetchList);
    if (res != null) return dispatch(res);
    return Promise.resolve();
  };
}

export function load(id) {
  return (dispatch, getState) => {
    let { entities } = getState().tag;
    if (entities[id] == null) return dispatch(fetch(id));
    return Promise.resolve();
  };
}
