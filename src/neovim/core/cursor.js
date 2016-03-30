export default class Cursor {
  constructor(cursorEl, fontFamily, fontSize, screenCtx, pixelRatio) {
    this._pixelRatio = pixelRatio;
    this._el = cursorEl;
    this._ctx = screenCtx;
    this._position = {
      col: 0,
      row: 0
    }

    this._el.style.font = `${fontSize} "${fontFamily}"`;
    this.setPosition(0, 0);
    
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

  set row(row) {
    this._position.row = row;
    this._el.style.top = row * this.fontHeight;
  }

  set col(col) {
    this._position.col = col;
    this._el.style.left = col * this.fontWidth;
  }

  setPosition(row, col) {
    this.row = row;
    this.row = row;
  }

  get position() {
    return this._position;
  }

}
