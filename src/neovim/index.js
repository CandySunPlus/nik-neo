import React, { Component } from 'react'
import { createStore, applyMiddleware, combineReducers} from 'redux'

import logger from '../log'
import makeReducer from './reducers'
import Screen from './components/screen'


export default class Neovim extends Component {
  static logMiddleware(store) {
    return next => action => {
      logger.debug('dispatch action: ', action.type);
      return next(action);
    }
  }

  constructor(props) {
    super(props);
    this.store = applyMiddleware(Neovim.logMiddleware)(createStore)(
      combineReducers(makeReducer())
    );
  }

  onRedraw(events) {
    for (let event of events) {
      let [type, ...args] = event;
      this.store.dispatch({
        type: `nv_${type}`,
        args: args
      });
    }
  }

  render() {
    return (
      <Screen onRedraw={events => this.onRedraw(events)}
      argv={this.props.argv && []}
      store={this.store}
      width={this.props.width}
      height={this.props.height} />
    );
  }
}
