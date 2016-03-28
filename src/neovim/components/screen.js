import React, { Component } from 'react'
import * as Actions from '../actions'


export default class Screen extends Component {
  componentDidMount() {
    let { width, height, store, argv, onRedraw } = this.props;
    store.dispatch(Actions.attachScreen(
      this.refs.screen,
      width,
      height,
      argv,
      onRedraw
    ));
  }

  render() {
    return (
      <div className="screen" ref="screen">
        <canvas />
        <span className="cursor"></span>
      </div>
    );
  }
}
