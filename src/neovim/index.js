import React, { Component } from 'react'
import * as utils from '../utils'
import Screen from './components/screen'
import NeovimEventProxy from './core/proxy'


export default class Neovim extends Component {
  constructor(props) {
    super(props);
    this.neovimEventProxy = new NeovimEventProxy();
    utils.logger.debug('Neovim component inited.');
  }

  render() {
    return (
      <Screen argv={this.props.argv || []}
      eventProxy={this.neovimEventProxy}
      width={this.props.width}
      height={this.props.height}
      fontFamily={this.props.fontFamily || 'monospaces' }
      fontSize={this.props.fontSize || '12px' }
      />
    );
  }
}
