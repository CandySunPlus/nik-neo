import React, { Component } from 'react'
import NeovimEventEmitter from './event-emitter'
import logger from '../log'
import Screen from './components/screen'


export default class Neovim extends Component {

  constructor(props) {
    super(props);
    this.eventEmitter = new NeovimEventEmitter();
  }


  render() {
    return (
      <Screen argv={this.props.argv && []}
      eventEmitter={this.eventEmitter}
      width={this.props.width}
      height={this.props.height} />
    );
  }
}
