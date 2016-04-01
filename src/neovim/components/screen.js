import React, { Component } from 'react'
import * as NeovimEvents from '../core/events'
import * as utils from '../../utils'


export default class Screen extends Component {
  componentDidMount() {
    let { width, height, fontFamily, fontSize, eventProxy, argv} = this.props;
    eventProxy.emit('ui', NeovimEvents.attachScreen(
      this.refs.screen,
      width,
      height,
      fontFamily,
      fontSize,
      argv
    ));
  }

  render() {
    return (
      <div className="screen" ref="screen">
        <canvas />
        <span className="cursor" />
      </div>
    );
  }
}
