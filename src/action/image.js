import { createAction } from 'redux-actions';

import { genLoadList } from './list';
import api from './api';

export const FETCH_LIST = 'image/fetchList';
export const FETCH = 'image/fetch';
export const PATCH = 'image/patch';
export const RESET = 'image/reset';
export const SET = 'image/set';
export const ADD_TAG = 'image/addTag';
export const REMOVE_TAG = 'image/removeTag';
export const SET_TAG = 'image/setTag';
export const DESTROY = 'image/destroy';
export const SCAN = 'image/scan';

export const fetchList = createAction(FETCH_LIST,
  (name, filter, nextId) => ({ name, filter, nextId }),
  (name, filter, nextId) => ({
    name,
    filter,
    api: api('GET', '/images',
      { query: Object.assign({}, filter, { nextId }) }),
    schema: { items: ['image'] },
  }));

export const fetch = createAction(FETCH,
  id => ({ id }),
  id => ({ id, api: api('GET', `/images/${id}`), schema: 'image' }));

export const patch = createAction(PATCH,
  (id, data) => ({ id }),
  (id, data) => ({
    id,
    api: api('PATCH', `/images/${id}`, { body: data }),
    schema: 'image',
  }));

export const reset = createAction(RESET,
  () => ({}),
  (id) => ({ id }));

export const set = createAction(SET,
  (id, data) => ({ data }),
  (id, data) => ({ id }));

export const addTag = createAction(ADD_TAG,
  (id, data) => ({ data }),
  (id) => ({ id }));

export const removeTag = createAction(REMOVE_TAG,
  (id, tagId) => ({ tagId }),
  (id, tagId) => ({ id, tagId }));

export const setTag = createAction(SET_TAG,
  (id, tagId, data) => ({ tagId, data }),
  (id, tagId) => ({ id, tagId }));

export const scan = createAction(SCAN,
  () => {},
  () => ({ api: api('POST', '/images/scan') }));

export function loadList(name, filter, reset) {
  return (dispatch, getState) => {
    let res = genLoadList(getState().image, name, filter, reset, fetchList);
    if (res != null) return dispatch(res);
    return Promise.resolve();
  };
}

export function load(id) {
  return (dispatch, getState) => {
    let { images } = getState().entities;
    if (images[id] == null) return dispatch(fetch(id));
    return Promise.resolve();
  };
}

export function save(id) {
  return (dispatch, getState) => {
    let { images } = getState().entities;
    if (images[id].dirty) return dispatch(patch(id, images[id]));
    return Promise.resolve();
  };
}
