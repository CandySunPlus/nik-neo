import Immutable from 'immutable'
import Process from './process'
import logger from '../log'
import * as utils from './utils'

class Cursor {
  constructor(el, screen) {
    el.style.font = screen.fontStyle;
    el.style.top = this._row = 0;
    el.style.left = this._col = 0;
    el.style.lineHeight = 1;
    this._el = el;
    this._pixelRatio = window.devicePixelRatio || 1;
  }

  get x() {
    return this._col * this.fontWidth;
  }

  get y() {
    return this._row * this.fontHeight;
  }

  get col() {
    return this._col;
  }

  get row() {
    return this._row;
  }

  set col(col) {
    this._col = col;
    this._el.style.left = (col * this.fontWidth) + 'px';
  }

  set row(row) {
    this._row = row;
    this._el.style.top = (row * this.fontHeight) + 'px';
  }

  get fontWidth() {
    return this._el.clientWidth;
  }

  get fontHeight() {
    return this._el.clientHeight;
  }

  get fontDrawWidth() {
    return this.fontWidth * this._pixelRatio;
  }

  get fontDrawHeight() {
    return this.fontHeight * this._pixelRatio;
  }
}

export default class NeoVim {
  constructor(eventEmitter) {
    this._eventEmitter = eventEmitter;
    this._nvim = null;
    this._ctx = null;
    this._canvas = null;
    this._cursor = null;
    this._fgColor = 'rgb(0, 0, 0)';
    this._bgColor = 'rgb(255, 255, 255)';
    this._attrs = Immutable.Map();
    this._font = Immutable.Map({
      font_family: 'Letter Gothic for Powerline',
      font_size: '14'
    });
  }

  get fontStyle() {
    return `${this._font.get('font_size')}px "${this._font.get('font_family')}"`;
  }

  get canvasFontStyle() {
    let fontSize = this._font.get('font_size');
    let font = `${fontSize}px "${this._font.get('font_family')}"`;

    if (this._attrs.get('bold')) {
      font = 'bold ' + font;
    }

    if (this._attrs.get('italic')) {
      font = 'italic ' + font;
    }
    return font;
  }

  get cols() {
    return Math.floor(this._canvas.width / this._cursor.fontDrawWidth);
  }

  get rows() {
    return Math.floor(this._canvas.height / this._cursor.fontDrawHeight);
  }

  get bgColor() {
    let _fgColor = this._attrs.get('foreground') || this._fgColor;
    let _bgColor = this._attrs.get('background') || this._bgColor;
    return this._attrs.get('reverse') ? _fgColor : _bgColor;
  }

  get fgColor() {
    let _fgColor = this._attrs.get('foreground') || this._fgColor;
    let _bgColor = this._attrs.get('background') || this._bgColor;
    return this._attrs.get('reverse') ? _bgColor : _fgColor;
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

  attachScreen(screen, width, height, argv, onRedraw) {
    this._initScreen(screen.firstChild, width, height);
    this._initCursor(screen.lastChild);
    this._attach(argv, onRedraw);
    return this;
  }

  _initScreen(canvas, width, height) {

    this._ctx = canvas.getContext('2d');
    let devicePixelRatio = window.devicePixelRatio || 1;
    let backingStoreRatio = 1;

    this._pixelRatio = devicePixelRatio / backingStoreRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * this._pixelRatio;
    canvas.height = height * this._pixelRatio;

    logger.debug('Init Screen: ', width, height);

    this._canvas = canvas;
    this._ctx.scale(this._pixelRatio, this._pixelRatio);
  }

  _initCursor(cursor) {
    this._cursor = new Cursor(cursor, this);
  }

  _attach(argv, onRedraw) {
    let process = new Process('nvim', argv)
    .attach(this.cols, this.rows, (events) => this._onRedraw(events))
    .then(nvim => {
      this._nvim = nvim;
    }).catch(err => {
      throw err;
    });
  }

  _clearBlock(col, row, length) {
    this._ctx.fillStyle = this.bgColor;
    this._ctx.fillRect(
      col * this._cursor.fontWidth,
      row * this._cursor.fontHeight,
      length * this._cursor.fontWidth,
      this._cursor.fontHeight
    );
  }

  resize() {
  }

  putChars(...args) {

    if (args.length == 0) {
      return;
    }

    let chars = [];
    for (let arg of args) {
      chars = chars.concat(arg);
    }

    logger.debug(chars.join(''));

    this._clearBlock(this._cursor.col, this._cursor.row, chars.length);

    this._ctx.font = this.canvasFontStyle;
    this._ctx.fillStyle = this.fgColor;
    this._ctx.textBaseline = 'top';

    for (let char of chars) {
      let offsetX = this._cursor.x;
      let offsetY = this._cursor.y;
      this._ctx.fillText(char, offsetX, offsetY);
      this._cursor.col ++;
    }
  }

  setHighlight(...args) {
    let attrs = {}
    /**
     * Note:
     * [[{highlight_set}], [], [{highlight_set}]]
     * -> {merged_highlight_set}
     */
    for (let arg of args) {
      for (let _arg of arg) {
        attrs = { ...attrs, ..._arg }
      }
    }

    logger.debug(this._attrs.toJSON());

    if (Object.keys(attrs).length <= 0) {
      return;
    }

    this._attrs = this._attrs.withMutations(map => {
      for (let attr of Object.keys(attrs)) {
        if (attr == 'foreground' || attr == 'background') {
          map.set(attr, utils.getColorString(attrs[attr]));
        } else {
          map.set(attr, attrs[attr]);
        }
      }
    });
  }

  setCursorPosition(position) {
    let [row, col] = position;
    this._cursor.row = row;
    this._cursor.col = col;
  }

  updateFg(rgb) {
    logger.info(rgb);
    if (rgb != -1) {
      logger.info(rgb);
      this._fgColor = utils.getColorString(rgb);
      logger.info(this._fgColor);
    }
  }

  updateBg(rgb) {
    if (rgb != -1) {
      this._bgColor = utils.getColorString(rgb);
    }
  }

  clear() {
    this._ctx.fillStyle = this.bgColor;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }
}
