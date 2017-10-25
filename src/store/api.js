import { apiMarker } from '../action/api';
import 'whatwg-fetch';

// fetch lacks query parameters..
function getQueryString(params) {
  return Object.keys(params)
    .filter(k => params[k] != null)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

export const apiMiddleware = store => next => action => {
  if (action == null) return next(action);
  if (action.meta == null) return next(action);
  let apiData = action.meta.api || action.meta;
  if (apiData[apiMarker] == null) return next(action);
  // The action should be processed nevertheless
  next(Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      pending: true,
    }),
  }));
  // Client function should return a Promise
  let { endpoint } = apiData;
  const { method, options = {} } = apiData;
  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }
  // Init new options
  let newOptions = Object.assign({
    method: method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }, options);
  if (options.body) {
    newOptions.body = JSON.stringify(options.body);
  }
  if (options.query) {
    endpoint = endpoint + '?' + getQueryString(options.query);
  }
  endpoint = '/api' + endpoint;
  const newMeta = action.meta.api ? Object.assign({}, action.meta, {
    api: null,
    pending: false,
    result: true,
  }) : {};
  return fetch(endpoint, newOptions)
    .then(res => {
      return res.json().then(body => {
        let newAction;
        if (res.ok) {
          newAction = Object.assign({}, action, {
            meta: newMeta,
            payload: body,
          });
        } else {
          newAction = Object.assign({}, action, {
            error: true,
            meta: Object.assign({}, newMeta, { status: res.status }),
            payload: body,
          });
        }
        return store.dispatch(newAction);
      });
    }, err => {
      return store.dispatch(Object.assign({}, action, {
        error: true,
        meta: newMeta,
        payload: { name: err.name, message: err.stack },
      }));
    });
};

export default apiMiddleware;
