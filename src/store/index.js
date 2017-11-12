import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import apiMiddleware from './api';
import normalizeMiddleware from './normalize';

let reducers = require('../reducer');

export default function configureStore(initialState) {
  let logger;
  if (process.env.NODE_ENV === 'production') {
    logger = () => next => action => next(action);
  } else {
    logger = createLogger();
  }
  let reducer = combineReducers(reducers);
  let middlewares = applyMiddleware(
    thunkMiddleware,
    apiMiddleware,
    normalizeMiddleware,
    logger,
  );
  const store = middlewares(createStore)(reducer, initialState);
  if (module.hot) {
    module.hot.accept('../reducer', () => {
      reducers = require('../reducer');
      store.replaceReducer(combineReducers(reducers));
    });
  }
  return store;
}
