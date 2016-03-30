import Immutable from 'immutable'
import Process from './process'
import * as utils from '../../utils'
import Cursor from './cursor'

export default class NeoVim {
  constructor(eventEmitter) {
    this._eventEmitter = eventEmitter;
    this._pixelRatio = window.devicePixelRatio || 1;
    this._nvim = null;
    this._ctx = null;
    this._cursor = null;
  }

  _onRedraw(events) {
    for (let event of events) {
      let [type, ...args] = event;
      this._eventEmitter.emit('redraw', {
        type: `nv_${type}`,
        args: args
      });
    }
  }

  attachScreen(screenEl, width, height, fontFamily, fontSize, argv) {
    this._initScreen(screenEl, width, height, fontFamily, fontSize).then(({cols, rows}) => {
      new Process('nvim', argv)
      .attach(cols, rows, (events) => {this._onRedraw(events)})
      .then(nvim => {
        this._nvim = nvim;
      });
    });
  }

  _initScreen(screenEl, width, height, fontFamily, fontSize) {
    let promise = new Promise((resolve, reject) => {
      this._ctx = screenEl.firstChild.getContext('2d');

      // hdpi
      this._ctx.canvas.width = width * this._pixelRatio;
      this._ctx.canvas.height = height * this._pixelRatio;
      this._ctx.canvas.style.width = `${width}px`;
      this._ctx.canvas.style.heigh = `${height}px`;

      // initialize cursor
      this._cursor = new Cursor(screenEl.lastChild, fontFamily, fontSize, this._ctx, this._pixelRatio);

      resolve({
        rows: Math.floor(height / this._cursor.fontHeight),
        cols: Math.floor(width / this._cursor.fontWidth)
      });
    });

    return promise;
  }

  updateBackground(intRgb) {

  }

  updateForeground(intRgb) {

  }

  clearAll() {

  }

  setHighlight(...args) {

  }

  setCursorPosition(position) {

  }

  drawText(...args) {

  }

  resize([cols, rows]) {
    utils.logger.debug(cols, rows);
  }
}
