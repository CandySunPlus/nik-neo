import React, { Component } from 'react'
import { createStore, applyMiddleware, combineReducers} from 'redux'

import logger from '../log'
import { makeNeovimReducer, makeUIReducer } from './reducers'
import Process from './process'
import Screen from './components/screen'


export default class Neovim extends Component {
  constructor(props) {
    super(props);
    this.nvim = null;
    this.store = null;
  }
  
  static logMiddleware(store) {
    return next => action => {
      logger.debug('dispatch action: ', action.type);
      return next(action);
    }
  } 
  
  componentDidMount() {
    let argv = this.props.argv && [];
    let process = new Process('nvim', argv)
      .attach(50, 150, (events) => this.onRedraw(events))
      .then(nvim => {
        this.nvim = nvim;
        this.store = applyMiddleware(Neovim.logMiddleware)(createStore)(combineReducers({
          neovimReducer: makeNeovimReducer(nvim),
          uiReducer: makeUIReducer(this.refs.screen.getCanvasCtx())
        }));
      }).catch(err => {
        throw err;
      });
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
      <Screen ref="screen" width={this.props.width} height={this.props.height} />
    );
  }
}
