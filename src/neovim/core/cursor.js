import Immutable from 'immutable'
import * as utils from '../../utils'

export default class Cursor {
  constructor(cursorEl, fontFamily, fontSize, screenCtx, pixelRatio) {
    cursorEl.style.font = `${fontSize}px "${fontFamily}"`;

    this._el = cursorEl;
    this._ctx = screenCtx;
    this._position = {
      col: 0,
      row: 0,
      x: 0,
      y: 0
    };

    this._baseFontAttr = Immutable.Map({
      background: '#FFF',
      foreground: '#000',
      size: (fontSize * pixelRatio) + 'px',
      family: fontFamily,
      bold: false,
      italic: false,
      underline: false,
      undercurl: false,
      width: cursorEl.clientWidth,
      height: cursorEl.clientHeight,
      drawWidth: cursorEl.clientWidth * pixelRatio,
      drawHeight: cursorEl.clientHeight * pixelRatio
    });

    this._currentFontAttr = Immutable.Map(this._baseFontAttr);

    this.setPosition(0, 0);
  }

  set bgColor(color) {
    this._baseFontAttr = this._baseFontAttr.set(
      'background', utils.color.intRgbToHex(color)
    );
  }

  set fgColor(color) {
    this._baseFontAttr = this._baseFontAttr.set(
      'foreground', utils.color.intRgbToHex(color)
    );
  }

  set row(row) {
    this._position.row = row;
    this._position.y = row * this.fontDrawHeight;
    this._el.style.top = row * this.fontHeight + 'px';
  }

  set col(col) {
    this._position.col = col;
    this._position.x = col * this.fontDrawWidth;
    this._el.style.left = col * this.fontWidth + 'px';
  }
  
  get row() {
    return this._position.row;
  }
  
  get col() {
    return this._position.col;
  }

  get bgColor() {
    return this._baseFontAttr.get('background');
  }

  get fgColor() {
    return this._baseFontAttr.get('foreground');
  }

  get fontWidth() {
    return this._currentFontAttr.get('width');
  }

  get fontHeight() {
    return this._currentFontAttr.get('height');
  }

  get fontDrawWidth() {
    return this._currentFontAttr.get('drawWidth');
  }

  get fontDrawHeight() {
    return this._currentFontAttr.get('drawHeight');
  }


  get position() {
    return this._position;
  }

  get drawFontStyle() {
    let styles = [];
    for (let [key, value] of this._currentFontAttr) {
      if (key == 'bold' || key == 'italic') {
        if (value) {
          styles.push(key);
        }
      }
    }
    styles.push(this._currentFontAttr.get('size'));
    styles.push(this._currentFontAttr.get('family'));
    utils.logger.debug(styles.join(' '));
    return styles.join(' ');
  }
  
  setPosition(row, col) {
    this.row = row;
    this.col = col;
  }

  setCurrentFontAttr(highlight) {
    this._currentFontAttr = this._baseFontAttr.merge(
      Immutable.Map(highlight).map((value, key) => {
        if (['background', 'foreground'].indexOf(key) !== -1) {
          return utils.color.intRgbToHex(value);
        }
        return value;
      })
    );
  }


  /**
   * 用当前 font background 清空区域
   *
   * @param row 起始行
   * @param col 起始列
   * @param rows 行数
   * @param cols 列数
   */
  clearBlock(row, col, rows, cols) {
    this._ctx.fillStyle = this._currentFontAttr.get('background');
    this._ctx.fillRect(
      col * this.fontDrawWidth,
      row * this.fontDrawHeight,
      cols * this.fontDrawWidth,
      rows * this.fontDrawHeight
    );
  }

  putText(text) {
    this.clearBlock(
      this.position.row, this.position.col, 1, text.length
    );
    
    this._ctx.fillStyle = this._currentFontAttr.get('foreground');
    this._ctx.textBaseline = 'top';
    this._ctx.font = this.drawFontStyle;
    this._ctx.fillText(text, this.position.x, this.position.y);
    
    this.col += text.length;
  }

}
