import React, { Component } from 'react'
import * as NeovimEvents from '../events'
import logger from '../../log'


export default class Screen extends Component {
  componentDidMount() {
    logger.info(this.props);
    let { width, height, eventEmitter, argv} = this.props;
    eventEmitter.emit('ui', NeovimEvents.attachScreen(
      this.refs.screen,
      width,
      height,
      argv
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
