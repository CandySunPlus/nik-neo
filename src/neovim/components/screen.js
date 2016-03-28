import React, { Component } from 'react'


export default class Screen extends Component {
  componentWillMount() {
    this.pixelRatio = window.devicePixelRatio || 1;
  }

  componentDidMount() {
    let { width, height } = this.props;
    
    const ctx = this.refs.canvas.getContext('2d');
    this.refs.canvas.style.width = `${width}px`;
    this.refs.canvas.style.height = `${height}px`;
    
    this.refs.canvas.width = width * this.pixelRatio;
    this.refs.canvas.height = height * this.pixelRatio;
    
    ctx.scale(this.pixelRatio, this.pixelRatio);
  }
  
  getCanvas() {
    return this.refs.canvas;
  }

  render() {
    return (
      <canvas ref="canvas" />
    );
  }
}
