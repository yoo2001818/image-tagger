import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import * as sessionActions from './action/session';

import './style/index.scss';

// Since react-hot-loader should be able to replace this, we're using let for
// this.
let App = require('./container/app').default;
let createStore = require('./store').default;

let container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);

let store = createStore();
// Initially call session/fetch in here.
store.dispatch(sessionActions.fetch());

function renderApp() {
  render(
    <Provider store={store}>
      <AppContainer>
        <App />
      </AppContainer>
    </Provider>,
    container,
  );
}

renderApp();

// Needed for hot module replacement
if (module.hot) {
  module.hot.accept('./container/app', () => {
    App = require('./container/app').default;
    renderApp();
  });
}
