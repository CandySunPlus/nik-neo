import logger from '../log'
import * as utils from './utils' 

export function makeUIReducer(canvas) {
  const ui = new UI(canvas);
  return (state=canvas, action) => {
    switch (action.type) {
      case 'nv_update_fg':
        return state;
      case 'nv_update_bg':
        return ui.updateBg.apply(ui, action.args);
      case 'nv_clear':
        return ui.clear.apply(ui, action.args);
      default:
        return state;
    }
  }
}

export function makeNeovimReducer(nvim) {
  return (state=nvim, action) => {
    switch (action) {
      default:
        return state;
    }
  }
}

class UI {
  constructor(canvas) {
    this._ctx = canvas.getContext('2d');
    this._canvas = canvas;
    this._bgColor = 'rgb(0, 0, 0)';
  }

  updateBg(rgb) {
    if (rgb != -1) {
      this._bgColor = utils.getColorString(rgb);
    }
    return this._ctx;
  }
  
  clear() {
    this._ctx.fillStyle = this._bgColor;
    logger.debug(this._canvas);
    this._ctx.fillRect(0, 0, this._ctx.width, this._ctx.height);
    return this._ctx;
  }
}