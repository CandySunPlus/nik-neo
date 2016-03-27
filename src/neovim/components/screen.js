import React, { Component } from 'react'


export default class Screen extends Component {
  componentWillMount() {
    this.pixelRatio = window.devicePixelRatio || 1;
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    let {width, height} = this.props;
    this.resizeWithPixel(width, height);
  }

  resizeWithPixel(width, height) {
    this._resize(0, 0, width, height);
  }

  resize(rows, cols) {

  }

  _resize(rows, lines, width, height) {
    if (this.refs.canvas.width != width) {
      this.refs.canvas.width = width;
      this.refs.canvas.style.width = (width / this.pixelRatio) + 'px';
    }

    if (this.refs.canvas.height != height) {
      this.refs.canvas.height = height;
      this.refs.canvas.style.height = (height / this.pixelRatio) + 'px';
    }
  }

  render() {
    return (
      <canvas ref="canvas"></canvas>
    );
  }
}
