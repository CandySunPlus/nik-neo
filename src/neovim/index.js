import React, { Component } from 'react'
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'

import logger from '../log'
import reducers from './reducers'
import Process from './process'

const logMiddleware = store => next => action => {
  logger.debug('dispatch action: ', action.type);
  let result = next(action);
  return result;
};

const store = applyMiddleware(logMiddleware)(createStore)(reducers);

if (module.hot) {
  module.hot.accept('./', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}

const unsubscribe = store.subscribe(() => {

});

export default class Neovim extends Component {
  constructor(props) {
    super(props);
    new Process('nvim', []).attach(50, 140).then(nvim => {
      this.nvim = nvim
    });
  }

  componentWillUnmount() {
    unsubscribe();
  }

  render() {
    return (
      <Provider store={store}>
      <div>Hello Neovim</div>
      </Provider>
    );
  }
}
