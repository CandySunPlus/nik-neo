import Immutable from 'immutable'
import Process from './process'
import logger from '../log'
import * as utils from './utils'

class Cursor {
  constructor(el) {
    el.style.fontSize = '12px';
    el.style.fontFamily = 'Fira Code';
    el.style.top = this._row = 0;
    el.style.left = this._col = 0;
    el.style.lineHeight = 1;
    this._el = el;
    this._pixelRatio = window.devicePixelRatio || 1;
  }

  get x() {
    return this.fontWidth * this._col;
  }

  get y() {
    return (this._row + 1) * this.fontHeight;
  }

  set col(col) {
    this._col = col;
    this._el.style.left = (col * this._el.clientWidth) + 'px';
  }

  set row(row) {
    this._row = row;
    this._el.style.top = (row * this._el.clientHeight) + 'px';
  }

  get fontWidth() {
    return this._el.clientWidth * this._pixelRatio;
  }

  get fontHeight() {
    return this._el.clientHeight * this._pixelRatio;
  }

}

export default class NeoVim {
  constructor() {
    this._pixelRatio = window.devicePixelRatio || 1;
    this._nvim = null;
    this._ctx = null;
    this._canvas = null;
    this._cursor = null;
    this._fgColor = 'rgb(0, 0, 0)';
    this._bgColor = 'rgb(255, 255, 255)';
    this._attrs = Immutable.Map();
    this._font = Immutable.Map({
      font_family: 'Letter Gothic for Powerline',
      font_size: '12'
    });
  }

  get fontStyle() {
    return `${this._font.get('font_family')} ${this._font.get('font_size')}px`;
  }

  get canvasFontStyle() {
    let fontSize = this._font.get('font_size') * this._pixelRatio;
    let font = `${this._font.get('font_family')} ${fontSize}`;

    if (this._attrs.get('bold')) {
      font = 'bold ' + font;
    }

    if (this._attrs.get('italic')) {
      font = 'italic ' + font;
    }
    return font;
  }

  attachScreen(screen, width, height, argv, onRedraw) {
    this._initScreen(screen.firstChild, width, height);
    this._initCursor(screen.lastChild);

    this._attach(argv, onRedraw);
    return this;
  }

  _initScreen(canvas, width, height) {

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * this._pixelRatio;
    canvas.height = height * this._pixelRatio;

    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._ctx.scale(this._pixelRatio, this._pixelRatio);
  }

  _initCursor(cursor) {
    this._cursor = new Cursor(cursor);
  }

  _attach(argv, onRedraw) {
    let process = new Process('nvim', argv)
    .attach(this.rows, this.cols, onRedraw)
    .then(nvim => {
      this._nvim = nvim;
    }).catch(err => {
      throw err;
    });
  }


  get rows() {
    return Math.floor(this._canvas.width / this._cursor.fontWidth);
  }

  get cols() {
    return Math.floor(this._canvas.height / this._cursor.fontHeight);
  }

  putChars(chars) {
    if (chars.length == 0) {
      return this.state;
    }
    this._ctx.font = this.canvasFontStyle;
    this._ctx.fillStyle = this._bgColor;
    this._ctx.textBaseline = 'bottom';
    let offsetX = this._cursor.x;
    let offsetY = this._cursor.y;
    for (let char of chars) {
      logger.info(char, offsetX, offsetY);
      this._ctx.fillText(char, offsetX, offsetY);
      offsetX += this._cursor.fontWidth;
    }
    return this;
  }

  setHighlight(attrs) {
    this._attrs = this._attrs.withMutations(map => {
      for (let attr of Object.keys(attrs)) {
        if (attr == 'fg_color' || attr == 'bg_color') {
          map.set(attr, utils.getColorString(attrs[attr]));
        } else {
          map.set(attr, attrs[attr]);
        }
      }
    });
    return this;
  }

  setCursorPosition(position) {
    let [row, col] = position;
    this._cursor.row = row;
    this._cursor.col = col;
    return this;
  }

  updateBg(rgb) {
    if (rgb != -1) {
      this._bgColor = utils.getColorString(rgb);
    }
    return this;
  }

  clear() {
    this._ctx.fillStyle = this._bgColor;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    return this;
  }
}
