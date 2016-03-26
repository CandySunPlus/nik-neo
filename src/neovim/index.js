import React, { Component } from 'react'
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'

import logger from '../log'
import reducers from './reducers'
import Process from './process'
import Screen from './components/screen'

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

    let argv = props.argv && [];

    new Process('nvim', argv).attach(50, 140).then(nvim => {
      this.nvim = nvim
    });
  }

  componentWillUnmount() {
    unsubscribe();
  }

  render() {
    let { width, height } = this.props;
    return (
      <Provider store={store}>
      <Screen width={width} height={height} />
      </Provider>
    );
  }
}
